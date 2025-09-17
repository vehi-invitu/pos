/** @odoo-module **/

import {useService} from "@web/core/utils/hooks";
import {patch} from "@web/core/utils/patch";
import {_t} from "@web/core/l10n/translation";
import {AttachmentPopup} from "@pos_order_attachment/app/utils/attachment_popup/attachment_popup.esm";
import { usePos } from "@point_of_sale/app/store/pos_hook";


patch(AttachmentPopup.prototype, {
    setup() {
        super.setup();
        this.pos = usePos();
        this.notification = useService("notification");
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
            const response = await fetch(scanServerURL + "api/scan", {
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
                await this.orm.call("pos.order", "attach_document_from_url", [
                    [order.uid], scanResult.file_url]
                );
                this.notification.add(
                    _t("Document scanned and attached successfully."),
                    {
                        type: "success",
                        title: _t("Success"),
                    }
                );
            } else if (scanResult && scanResult.image_data) {
                await this.orm.call("pos.order", "attach_document", [
                    [order.uid], scanResult.image_data]
                );
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
