from odoo import api, models


class Partner(models.Model):
    _inherit = "res.partner"

    @api.depends("ref")
    @api.depends_context("show_ref")
    def _compute_display_name(self):
        res = super()._compute_display_name()
        if self._context.get("show_ref"):
            for partner in self:
                name = partner.with_context(lang=self.env.lang)._get_complete_name()
                name = f"{name} ({partner.ref})"
                partner.display_name = name.strip()
        return res
