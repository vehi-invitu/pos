from odoo import models


class PosOrder(models.Model):
    _inherit = "pos.order"

    def _create_splitting_invoice(self, move_vals):
        new_move = super()._create_splitting_invoice(move_vals)
        if self.env.company.splitting_invoices_review:
            new_move.to_check = True
        return new_move
