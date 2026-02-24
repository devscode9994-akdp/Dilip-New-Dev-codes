# About Feature code - Dynamic GST percentage amount in PDP page

## 📌 Description

- We have implemented this feature like, In the PDP page, From the product object, we took price and we have implemented the dynamic product GST percentage amount task

## 🧠 Code Explanation

- First We took product price.
- Later we converted it into rupees format using {% assign product_price_in_float_digits = product.price | divided_by: 100 %}
- Later we calculated the percentage amount using formalua like {% assign percentage_amount = product_price_in_float_digits | times: percentage | divided_by: 100 | round: 2 %}
- Later we converted the percentage amount by using below formula like {{ percentage_amount | times: 100 | money_without_currency }}