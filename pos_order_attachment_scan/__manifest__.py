# Copyright 2025 INVITU (https://www.invitu.com/)
{
    "name": "POS Order Attachment Scan",
    "version": "17.0.1.0.0",
    "summary": "Allows scanning and attaching documents to POS orders.",
    "description": """
        This module integrates with a scan server to allow POS users to directly
        scan documents and attach them to the current order.
    """,
    "category": "Point of Sale",
    "author": "INVITU",
    "website": "https://github.com/OCA/pos",
    "depends": ["pos_order_attachment"],
    "data": [
        "views/pos_config_views.xml",
        "views/res_config_settings_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_order_attachment_scan/static/src/js/screens.esm.js",
            "pos_order_attachment_scan/static/src/xml/screens.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "license": "AGPL-3",
}
