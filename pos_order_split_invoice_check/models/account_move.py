# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl.html).

from odoo import fields, models


class AccountMove(models.Model):
    _name = "account.move"
    _inherit = "account.move"

    pricelist_id = fields.Many2one(
        related="splitting_order_id.pricelist_id", string="Pricelist"
    )
