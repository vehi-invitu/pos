/** @odoo-module **/

import {AttachmentPopup} from "pos_order_attachment.AttachmentPopup";
import {useService} from "@web/core/utils/hooks";
import {patch} from "@web/core/utils/patch";
import {_t} from "web.core";

patch(AttachmentPopup.prototype, {
    setup() {
        super.setup();
        this.pos = useService("point_of_sale");
        this.notification = useService("pos.notification");
    },

    async _onClickScanAttachment() {
        const order = this.pos.get_order();
        const scanServerURL = this.pos.config.scan_server_url;

        if (!scanServerURL) {
            this.notification.add(
                _t("Scan Server URL is not configured in POS settings."),
                {
                    type: "danger",
                }
            );
            return;
        }

        try {
            const response = await fetch(scanServerURL + "/scan", {
                method: "GET",
            });

            if (!response.ok) {
                const errorData = await response.json();
                this.notification.add(
                    _t("Failed to initiate scan.") +
                        (errorData.message ? ` ${errorData.message}` : ""),
                    {
                        type: "danger",
                        title: _t("Scan Error"),
                    }
                );
                return;
            }

            const scanResult = await response.json();

            if (scanResult && scanResult.file_url) {
                await this.pos.env.services.rpc({
                    model: "pos.order",
                    method: "attach_document_from_url",
                    args: [[order.uid], scanResult.file_url, "scanned_document"],
                });
                this.notification.add(
                    _t("Document scanned and attached successfully."),
                    {
                        type: "success",
                        title: _t("Success"),
                    }
                );
            } else if (scanResult && scanResult.image_data) {
                await this.pos.env.services.rpc({
                    model: "pos.order",
                    method: "attach_document",
                    args: [[order.uid], "scanned_document.png", scanResult.image_data],
                });
                this.notification.add(
                    _t("Document scanned and attached successfully."),
                    {
                        type: "success",
                        title: _t("Success"),
                    }
                );
            } else {
                this.notification.add(
                    _t("No file URL or image data received from the scan server."),
                    {
                        type: "danger",
                        title: _t("Scan Error"),
                    }
                );
            }
        } catch (error) {
            console.error("Error during scan:", error);
            this.notification.add(_t("An error occurred during the scan process."), {
                type: "danger",
                title: _t("Error"),
            });
        }
    },
});
