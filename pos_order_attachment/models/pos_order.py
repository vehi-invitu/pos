# Copyright 2024 Dixmit
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import api, fields, models


class PosOrder(models.Model):
    _name = "pos.order"
    _inherit = ["pos.order", "mail.thread"]

    has_attachments = fields.Boolean(
        compute="_compute_has_attachments", search="_search_has_attachments"
    )
    has_no_attachments = fields.Boolean(
        compute="_compute_has_attachments", search="_search_has_no_attachments"
    )

    def _compute_has_attachments(self):
        __import__("pdb").set_trace()
        # pour chaque enregistrement
        for record in self:
            # je vais chercher les attachments du model pos.order
            # et que le res_id est l'id du record actuel
            attachments = self.env["ir.attachment"].search_count(
                [
                    ("res_model", "=", "pos.order"),
                    ("res_id", "=", record.id),
                ]
            )
            # si le résultat de la recherche est supérieur à 0
            if attachments > 0:
                # renvoie vrai
                record.has_attachments = True
            # sinon
            else:
                # renvoie faux
                record.has_attachments = False

    def _search_has_attachments(self, operator, value):
        orders = []
        attachment_ids = self.env["ir.attachment"].search(
            [
                ("res_model", "=", "pos.order"),
            ]
        )
        for attachment in attachment_ids:
            orders.append(attachment.res_id)
        return [("id", "in", orders)]

    def _search_has_no_attachments(self, operator, value):
        orders = []
        attachment_ids = self.env["ir.attachment"].search(
            [
                ("res_model", "=", "pos.order"),
            ]
        )
        for attachment in attachment_ids:
            orders.append(attachment.res_id)
        return [("id", "not in", orders)]

    @api.model_create_multi
    def create(self, vals_list):
        # We want to avoid to subscribe automatically on creation
        return super(PosOrder, self.with_context(mail_create_nosubscribe=True)).create(
            vals_list
        )

    def _export_for_ui(self, order):
        result = super()._export_for_ui(order)
        result["message_attachment_count"] = order.message_attachment_count
        return result

    def pos_attachments(self):
        self.ensure_one()
        return self._get_mail_thread_data_attachments()._attachment_format()
