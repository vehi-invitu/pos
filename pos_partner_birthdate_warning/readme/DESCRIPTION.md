This module enhances Odoo's Point of Sale (POS) by introducing an age verification system.
When a customer is selected and their age is **less than or equal** to the **"Age Warning"** threshold set
in the POS configuration, a warning popup will appear. The customer's name and age (e.g., John DOE (14 y)) will
be displayed in **red** on the POS interface to alert the cashier.

## Use Cases
### **Case 1: Alcohol Sales**
- **"Age Warning" threshold set to 18 years**.
- A customer born on **June 5, 2010**, is selected in **March 2025**.
- **Age**: 2025 - 2010 = **14 years old**.
- **Result**: A warning popup appears on the POS interface, displaying the customer's name and age in red to alert the cashier.

### **Case 2: Customer is of Legal Age**
- **"Age Warning" threshold set to 18 years**.
- A customer born on **February 2, 2003**, is selected in **March 2025**.
- **Age**: 2025 - 2003 = **22 years old**.
- **Result**: No warning, as the customer is above the age limit.

### **Case 3: Gaming Center (No entry for under 16s)**
- **"Age Warning" threshold set to 16 years**.
- A customer born on **July 15, 2009**, is selected in **March 2025**.
- **Age**: 2025 - 2009 = **15 years old** (but birthday in July).
- **Result**: A warning popup appears on the POS interface, displaying the customer's name and age in red to alert the cashier.

### **Case 4: No birthdate**
- **"Age Warning" threshold set to 16 years**.
- **Result**: No warning, the customer's birthdate is unavailable.
