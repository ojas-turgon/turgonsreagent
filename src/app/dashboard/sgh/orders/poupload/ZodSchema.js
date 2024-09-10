import { z } from 'zod';

export const schema = z.object({
  isPurchaseOrder: z.boolean().describe(
    'Is this a purchase order? True, if this document is a purchase order, false otherwise.   Purchase order \
  typically have a buyer name, address, invoice email, shipping details etc. table that lists all the items in the purchase order, followed by a final Total, which is a sum of total price of all items in the table.'
  ),
  buyer_name: z.object({
    value: z
      .string()
      .describe(
        'Name of the company issuing the purchase order to Smart Global Holdings or Smart Modular Technologies or any similar sounding group company. \
        Buyer name is usually seen in big and bold on the top of the letterhead header.  Buyer name cannot be Smart Modular Technologies or Smart Global Holdings.'
      )
      .refine((val) => val.trim() !== '', {
        message: 'Buyer name is required',
      }),
    confidence: z
      .number()
      .min(0)
      .max(100)
      .describe('Your Confidence in the prediction of the buyer name. How certain are you that you got this correct ?'),
  }),
  buyer_address: z.object({
    value: z
      .string()
      .describe('Address of the company issuing the purchase order')
      .refine((val) => val.trim() !== '', {
        message: 'Buyer address is required',
      }),
    confidence: z
      .number()
      .min(0)
      .max(100)
      .describe(
        'Your Confidence in the prediction of the buyer address. How certain are you that you got this correct ?'
      ),
  }),
  billing_address: z.object({
    value: z
      .string()
      .describe('The name and address of the billing entity')
      .refine((val) => val.trim() !== '', {
        message: 'Billing address is required',
      }),
    confidence: z
      .number()
      .min(0)
      .max(100)
      .describe(
        'Your Confidence in the prediction of the billing_address. How certain are you that you got this correct ?'
      ),
  }),
  invoice_email: z.object({
    value: z
      .string()
      .email({ message: 'Invalid email format' })
      .describe('The email address to send the invoice to')
      .refine((val) => val.trim() !== '', {
        message: 'Email address is required',
      }),
    confidence: z
      .number()
      .min(0)
      .max(100)
      .describe('Your Confidence in the prediction of the division. How certain are you that you got this correct ?'),
  }),
  items: z
    .array(
      z.object({
        part_number: z.object({
          value: z.string().describe('The Part Number'),
          confidence: z
            .number()
            .min(0)
            .max(100)
            .describe(
              'Your Confidence in the prediction of the part number. How certain are you that you got this correct ?'
            ),
        }),
        order_quantity: z.object({
          value: z.number().describe('The order quantity.  Must be a number.'),
          confidence: z
            .number()
            .min(0)
            .max(100)
            .describe(
              'Your Confidence in the prediction of the order quantity. How certain are you that you got this correct ?'
            ),
        }),
        part_description: z.object({
          value: z.string().describe('The part description'),
          confidence: z
            .number()
            .min(0)
            .max(100)
            .describe(
              'Your Confidence in the prediction of the part description. How certain are you that you got this correct ?'
            ),
        }),
        price: z.object({
          value: z.string().describe('The price of each item'),
          confidence: z
            .number()
            .min(0)
            .max(100)
            .describe(
              'Your Confidence in the prediction of the item price. How certain are you that you got this correct ?'
            ),
        }),
      })
    )
    .describe('The list of items'),
});

export const valueOnlyItemsSchema = z.object({
  part_number: z.string().refine((val) => val.trim() !== '', {
    message: 'Part number is required',
  }),
  order_quantity: z.number().min(0),
  part_description: z.string().refine((val) => val.trim() !== '', {
    message: 'Part description is required',
  }),
  price: z
    .string()
    .refine((val) => val.trim() !== '', {
      message: 'Price is required',
    })
    .refine((val) => !isNaN(parseFloat(val.replace(/[^\d.-]/g, ''))), {
      message: 'Price must be a valid number',
    }),
});

export const valueOnlySchema = z.object({
  buyer_name: z.string().refine((val) => val.trim() !== '', {
    message: 'Buyer name is required',
  }),
  buyer_address: z.string().refine((val) => val.trim() !== '', {
    message: 'Buyer address is required',
  }),
  billing_address: z.string().refine((val) => val.trim() !== '', {
    message: 'Billing address is required',
  }),
  invoice_email: z
    .string()
    .email({ message: 'Invalid email format' })
    .refine((val) => val.trim() !== '', {
      message: 'Email address is required',
    }),
  items: z.array(valueOnlyItemsSchema),
});

export const initialPoDetails = {
  buyer_name: 'buyer name',
  buyer_address: 'buyer address',
  billing_address: 'billing address',
  invoice_email: 'invoice email',
  items: [
    {
      part_number: 'part number',
      order_quantity: 0,
      part_description: 'part description',
      price: 'price',
    },
  ],
};

export function getValueOnlyZodSchema(inputSchema) {
  let valueOnlySchemaInternal = initialPoDetails;
  for (const key in inputSchema.shape) {
    if (key !== 'items') {
      valueOnlySchemaInternal[key] = inputSchema.shape[key].shape.value;
    } else {
      valueOnlySchemaInternal[key] = z.array(
        inputSchema.shape[key].element.shape.map((subSchema) => {
          const subSchemaObject = initialPoDetails.items[0];
          for (const subKey in subSchema.shape) {
            subSchemaObject[subKey] = subSchema.shape[subKey].shape.value;
          }
          return z.object(subSchemaObject);
        })
      );
    }
  }
  return valueOnlySchema;
}
export function getValueOnlyPO(po) {
  const voPO = initialPoDetails;
  for (const key in po) {
    if (key !== 'isPurchaseOrder') {
      if (key !== 'items') {
        voPO[key] = po[key]['value'];
      } else {
        voPO.items = [];
        po.items.forEach((item) => {
          let voItem = { ...initialPoDetails.items[0] }; // Create a new object to avoid reference issues
          for (const subKey in item) {
            voItem[subKey] = item[subKey]['value'];
          }
          voPO.items.push(voItem);
        });
      }
    } //else key isPurchaseOrder is ignored for value only form, used only for mesages
  }
  return voPO;
}
