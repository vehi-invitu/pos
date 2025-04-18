# Copyright 2025 INVITU (https://www.invitu.com/)

from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    pos_is_scan_server = fields.Boolean(
        related="pos_config_id.is_scan_server", readonly=False
    )
    pos_scan_server_url = fields.Char(
        related="pos_config_id.scan_server_url", readonly=False
    )
