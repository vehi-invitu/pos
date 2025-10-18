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
        this.orm = useService("orm");
        this.popup = useService("popup");
    },

    async _onClickScanAttachment() {
        const order = this.pos.get_order();
        const scanServerURL = this.pos.config.scan_server_url;
        if (!scanServerURL) {
            this.notification.add(
                _t("Scan Server URL is not configured in POS settings."),
                { type: "danger" }
            );
            return;
        }
        try {
            const scannerResponse = await fetch(`${scanServerURL}/api/scanners`);
            if (!scannerResponse.ok) throw new Error("Failed to fetch scanners");
            const scanners = await scannerResponse.json();
            const selectedScanner = scanners[0];
            const scannerIdForURL = encodeURIComponent(selectedScanner.id);
            const scanResponse = await fetch(`${scanServerURL}/api/scan/${scannerIdForURL}`);

            if (!scanResponse.ok) {
                const errorText = await response.text();
                this.notification.add(
                    _t("Failed to initiate scan: ") + errorText,
                    { type: "danger", title: _t("Scan Error") }
                );
                return;
            }

            const scanResult = await scanResponse;

            let attachmentId = false;
            if (scanResult.body instanceof ReadableStream){
                const scanResult = await scanResponse.blob();
                const reader = new FileReader();
                const base64Data = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(scanResult);
                });

                attachmentId = await this.orm.call(
                    "pos.order",
                    "attach_document",
                    [[order.server_id], base64Data]
                );
            } else if (scanResult && scanResult.url) {
                attachmentId = await this.orm.call(
                    "pos.order",
                    "attach_document_from_url",
                    [[order.server_id], scanResult.url]
                );
            } else if (scanResult && scanResult.image_data) {
                attachmentId = await this.orm.call(
                    "pos.order",
                    "attach_document",
                    [[order.server_id], scanResult.image_data]
                );
            } else {
                this.notification.add(
                    _t("No valid file URL or image data received from the scanner."),
                    { type: "danger", title: _t("Scan Error") }
                );
                return;
            }

            if (attachmentId) {
                this.notification.add(
                    _t("Document scanned and attached successfully."),
                    { type: "success", title: _t("Success") }
                );

                await this.popup.add(AttachmentPopup, {
                    order,
                    title: _t("Order Attachments"),
                });
            }
        } catch (error) {
            this.notification.add(_t("An error occurred during the scan process."), {
                type: "danger",
                title: _t("Error"),
            });
        }
    },
});
