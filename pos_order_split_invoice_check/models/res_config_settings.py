from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    splitting_invoices_review = fields.Boolean(
        related="company_id.splitting_invoices_review",
        readonly=False,
        help="Set to True if your company's splitting invoices need to be checked.",
    )
