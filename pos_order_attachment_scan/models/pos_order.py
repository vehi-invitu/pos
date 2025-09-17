
from odoo import api, models


class PosOrder(models.Model):
    _name = "pos.order"

    # def pos_attachments(self):
    #     self.ensure_one()
    #     return self._get_mail_thread_data_attachments()._attachment_format()

    def attach_document_from_url(self, order_uid, file_url):
        pass

    def attach_document(self, order_uid, image_data):
        pass

