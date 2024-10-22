import { IProductAttribute } from "./global-types";

export const x: IProductAttribute[] = [
  {
    name: "Processor",
    attributeControlType: "dropdown",
    values: [
      {
        name: "2.2 GHz Intel Pentium Dual-Core E2200",
        priceAdjustmentValue: 0,
      },
      {
        name: "2.5 GHz Intel Pentium Dual-Core E2200",
        priceAdjustmentValue: 15,
      },
    ],
  },
  {
    name: "RAM",
    attributeControlType: "dropdown",
    values: [
      {
        name: "2 GB",
        priceAdjustmentValue: 0,
      },
      {
        name: "4GB",
        priceAdjustmentValue: 20,
      },
      {
        name: "8GB",
        priceAdjustmentValue: 60,
      },
    ],
  },
  {
    name: "HDD",
    attributeControlType: "dropdown",
    values: [
      {
        name: "320 GB",
        priceAdjustmentValue: 0,
      },
      {
        name: "400 GB",
        priceAdjustmentValue: 100,
      },
    ],
  },
  {
    name: "OS",
    attributeControlType: "radio",
    values: [
      {
        name: "Vista Home",
        priceAdjustmentValue: 50,
      },
      {
        name: "Vista Premium",
        priceAdjustmentValue: 60,
      },
    ],
  },
  {
    name: "Software",
    attributeControlType: "checkbox",
    values: [
      {
        name: "Microsoft Office",
        priceAdjustmentValue: 50,
      },
      {
        name: "Acrobat Reader",
        priceAdjustmentValue: 10,
      },
      {
        name: "Total Commander",
        priceAdjustmentValue: 5,
      },
    ],
  },
];
