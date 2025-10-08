# -*- coding: utf-8 -*-
from odoo import api, fields, models
import base64
import requests
import mimetypes

class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def attach_document_from_url(self, order_ids, file_url):
        """
        Download a file from the given URL and attach it to the POS Order.
        Used when the ScanServer returns a file_url.
        """
        if not order_ids or not file_url:
            return False

        order = self.browse(order_ids[0])
        if not order.exists():
            return False

        response = requests.get(file_url, timeout=15)

        filename = "scanned_document"
        if "." not in filename:
            filename += ".pdf" 

        content = base64.b64encode(response.content)
        mime_type, _ = mimetypes.guess_type(filename)
        mime_type = mime_type or "application/octet-stream"
        attachment = self.env["ir.attachment"].create({
            "name": filename,
            "datas": content,
            "res_model": "pos.order",
            "res_id": order.id,
            "mimetype": mime_type,
        })
        return attachment.id

    @api.model
    def attach_document(self, order_ids, image_data):
        """
        Attach a base64-encoded image (from ScanServer) to the POS Order.
        Used when the ScanServer returns inline base64 data.
        """
        if not order_ids or not image_data:
            return False

        order = self.browse(order_ids[0])
        if not order.exists():
            return False

        if "," in image_data:
            image_data = image_data.split(",")[1]
        try:
            decoded = base64.b64decode(image_data)
        except Exception as e:
            raise Exception(f"Invalid base64 image data: {e}")

        attachment = self.env["ir.attachment"].create({
            "name": "scanned_document.png",
            "datas": base64.b64encode(decoded),
            "res_model": "pos.order",
            "res_id": order.id,
            "mimetype": "image/png",
        })
        return attachment.id
