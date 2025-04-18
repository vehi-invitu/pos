# Copyright 2025 INVITU (https://www.invitu.com/)
from odoo import fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    is_scan_server = fields.Boolean(
        string="Scan Server",
        help="Connect scanner to your Windows PC and launch scan_server.",
    )
    scan_server_url = fields.Char(
        string="Scan Server URL", help="URL of the scan server"
    )
