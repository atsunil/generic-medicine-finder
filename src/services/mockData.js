/**
 * Comprehensive verified fixture data for Indian pharmaceuticals,
 * Jan Aushadhi Kendras (PMBJP), and price comparisons.
 */

export const MOCK_MEDICINES = [
  {
    brandName: "Augmentin 625 Duo",
    aliases: ["augmentin", "augmentin 625", "augmentin duo", "amoxyclav", "amoxyclav 625"],
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd",
    saltComposition: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    activeIngredients: [
      { name: "Amoxicillin", strength: "500mg", unit: "mg", value: 500 },
      { name: "Clavulanic Acid", strength: "125mg", unit: "mg", value: 125 }
    ],
    totalStrength: "625mg",
    dosageForm: "Tablet",
    therapeuticClass: "Antibiotic (Broad Spectrum)",
    isChronic: false,
    brandedDetails: {
      packSize: 10,
      mrp: 204.50,
      pricePerUnit: 20.45,
      source: "Tata 1mg",
      sourceUrl: "https://www.1mg.com/drugs/augmentin-625-duo-tablet-138629",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Amoxycillin and Potassium Clavulanate Tablets IP 625mg",
      saltComposition: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
      packSize: 10,
      primaryPrice: 58.00,
      pricePerUnit: 5.80,
      savingsPercentage: 71.6,
      janAushadhiCode: "PMBJP00102"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Amoxycillin 500mg + Clavulanate 125mg Tablets IP",
        price: 58.00,
        packSize: 10,
        pricePerUnit: 5.80,
        savingsPercent: 71.6,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.8,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Zeelab Pharmacy",
        productTitle: "Amoxyclav 625 Generic Tablet",
        price: 65.00,
        packSize: 10,
        pricePerUnit: 6.50,
        savingsPercent: 68.2,
        inStock: true,
        deliveryDays: "2-3 business days",
        rating: 4.5,
        sourceUrl: "https://zeelabpharmacy.com/product/amoxyclav-625",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Amoxicillin and Clavulanate Potassium 625mg",
        price: 62.00,
        packSize: 10,
        pricePerUnit: 6.20,
        savingsPercent: 69.7,
        inStock: true,
        deliveryDays: "1-2 business days",
        rating: 4.6,
        sourceUrl: "https://genericaadhaar.com/amoxyclav-625",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Dawaa Dost",
        productTitle: "Generic Amoxyclav 625 Tablets",
        price: 70.00,
        packSize: 10,
        pricePerUnit: 7.00,
        savingsPercent: 65.8,
        inStock: true,
        deliveryDays: "1 business day",
        rating: 4.4,
        sourceUrl: "https://dawaadost.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Apollo Pharmacy Generics",
        productTitle: "Apollo Pharmacy Amoxicillin Clavulanic 625",
        price: 88.00,
        packSize: 10,
        pricePerUnit: 8.80,
        savingsPercent: 57.0,
        inStock: true,
        deliveryDays: "Same day delivery",
        rating: 4.7,
        sourceUrl: "https://apollopharmacy.in",
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    brandName: "Glycomet 500",
    aliases: ["glycomet", "glycomet 500", "metformin 500", "glyciphage 500", "obimet 500"],
    manufacturer: "USV Private Limited",
    saltComposition: "Metformin Hydrochloride (500mg)",
    activeIngredients: [
      { name: "Metformin Hydrochloride", strength: "500mg", unit: "mg", value: 500 }
    ],
    totalStrength: "500mg",
    dosageForm: "Tablet",
    therapeuticClass: "Anti-Diabetic (Biguanide)",
    isChronic: true,
    conditionTag: "Type 2 Diabetes",
    brandedDetails: {
      packSize: 20,
      mrp: 48.00,
      pricePerUnit: 2.40,
      source: "PharmEasy",
      sourceUrl: "https://pharmeasy.in/online-medicine-order/glycomet-500mg-strip-of-20-tablets-13425",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Metformin Hydrochloride Prolonged-Release Tablets IP 500mg",
      saltComposition: "Metformin Hydrochloride (500mg)",
      packSize: 10,
      primaryPrice: 6.50,
      pricePerUnit: 0.65,
      savingsPercentage: 72.9,
      janAushadhiCode: "PMBJP00085"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Metformin Hydrochloride Tablets IP 500mg (Pack of 10)",
        price: 6.50,
        packSize: 10,
        pricePerUnit: 0.65,
        savingsPercent: 72.9,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.9,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Generic Metformin 500mg Tablets (Pack of 10)",
        price: 8.00,
        packSize: 10,
        pricePerUnit: 0.80,
        savingsPercent: 66.7,
        inStock: true,
        deliveryDays: "1-2 days",
        rating: 4.6,
        sourceUrl: "https://genericaadhaar.com/metformin-500",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Zeelab Pharmacy",
        productTitle: "Metformin 500mg Generic Tablets",
        price: 7.50,
        packSize: 10,
        pricePerUnit: 0.75,
        savingsPercent: 68.8,
        inStock: true,
        deliveryDays: "2-3 days",
        rating: 4.5,
        sourceUrl: "https://zeelabpharmacy.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Tata 1mg Jan Aushadhi Partner",
        productTitle: "Metformin 500mg IP (Generic)",
        price: 11.00,
        packSize: 10,
        pricePerUnit: 1.10,
        savingsPercent: 54.2,
        inStock: true,
        deliveryDays: "1-2 days",
        rating: 4.7,
        sourceUrl: "https://1mg.com",
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    brandName: "Telma 40",
    aliases: ["telma", "telma 40", "telmisartan 40", "telmikind 40", "telsartan 40"],
    manufacturer: "Glenmark Pharmaceuticals Ltd",
    saltComposition: "Telmisartan (40mg)",
    activeIngredients: [
      { name: "Telmisartan", strength: "40mg", unit: "mg", value: 40 }
    ],
    totalStrength: "40mg",
    dosageForm: "Tablet",
    therapeuticClass: "Anti-Hypertensive (ARB)",
    isChronic: true,
    conditionTag: "Hypertension / High Blood Pressure",
    brandedDetails: {
      packSize: 15,
      mrp: 142.50,
      pricePerUnit: 9.50,
      source: "Tata 1mg",
      sourceUrl: "https://www.1mg.com/drugs/telma-40-tablet-36173",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Telmisartan Tablets IP 40mg",
      saltComposition: "Telmisartan (40mg)",
      packSize: 10,
      primaryPrice: 18.00,
      pricePerUnit: 1.80,
      savingsPercentage: 81.1,
      janAushadhiCode: "PMBJP00318"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Telmisartan Tablets IP 40mg (Pack of 10)",
        price: 18.00,
        packSize: 10,
        pricePerUnit: 1.80,
        savingsPercent: 81.1,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.9,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Generic Telmisartan 40mg (Pack of 10)",
        price: 20.00,
        packSize: 10,
        pricePerUnit: 2.00,
        savingsPercent: 78.9,
        inStock: true,
        deliveryDays: "1-2 days",
        rating: 4.6,
        sourceUrl: "https://genericaadhaar.com/telmisartan-40",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Zeelab Pharmacy",
        productTitle: "Telmisartan 40mg Tablets Generic",
        price: 22.00,
        packSize: 10,
        pricePerUnit: 2.20,
        savingsPercent: 76.8,
        inStock: true,
        deliveryDays: "2-3 days",
        rating: 4.5,
        sourceUrl: "https://zeelabpharmacy.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Netmeds Generics",
        productTitle: "Telmisartan 40mg Strip (Generic)",
        price: 28.00,
        packSize: 10,
        pricePerUnit: 2.80,
        savingsPercent: 70.5,
        inStock: true,
        deliveryDays: "Same day",
        rating: 4.6,
        sourceUrl: "https://netmeds.com",
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    brandName: "Thyronorm 50 mcg",
    aliases: ["thyronorm", "thyronorm 50", "thyroxine 50", "eltroxin 50", "thyronorm 50mcg"],
    manufacturer: "Abbott Healthcare Pvt Ltd",
    saltComposition: "Thyroxine Sodium (50mcg)",
    activeIngredients: [
      { name: "Thyroxine Sodium", strength: "50mcg", unit: "mcg", value: 50 }
    ],
    totalStrength: "50mcg",
    dosageForm: "Tablet",
    therapeuticClass: "Hormone Replacement",
    isChronic: true,
    conditionTag: "Hypothyroidism",
    brandedDetails: {
      packSize: 120,
      mrp: 185.00,
      pricePerUnit: 1.54,
      source: "Tata 1mg",
      sourceUrl: "https://www.1mg.com/drugs/thyronorm-50mcg-tablet-36340",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Thyroxine Sodium Tablets IP 50mcg",
      saltComposition: "Thyroxine Sodium (50mcg)",
      packSize: 100,
      primaryPrice: 45.00,
      pricePerUnit: 0.45,
      savingsPercentage: 70.8,
      janAushadhiCode: "PMBJP00412"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Thyroxine Sodium Tablets IP 50mcg (100 Tablets)",
        price: 45.00,
        packSize: 100,
        pricePerUnit: 0.45,
        savingsPercent: 70.8,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.8,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Thyroxine 50mcg Generic Bottle",
        price: 52.00,
        packSize: 100,
        pricePerUnit: 0.52,
        savingsPercent: 66.2,
        inStock: true,
        deliveryDays: "2 days",
        rating: 4.5,
        sourceUrl: "https://genericaadhaar.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Zeelab Pharmacy",
        productTitle: "Thyroxine Sodium 50mcg Generic",
        price: 50.00,
        packSize: 100,
        pricePerUnit: 0.50,
        savingsPercent: 67.5,
        inStock: true,
        deliveryDays: "2-3 days",
        rating: 4.4,
        sourceUrl: "https://zeelabpharmacy.com",
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    brandName: "Pan 40",
    aliases: ["pan 40", "pantocid 40", "pantoprazole 40", "pan-40", "pantocid"],
    manufacturer: "Alkem Laboratories Ltd",
    saltComposition: "Pantoprazole Sodium (40mg)",
    activeIngredients: [
      { name: "Pantoprazole Sodium", strength: "40mg", unit: "mg", value: 40 }
    ],
    totalStrength: "40mg",
    dosageForm: "Tablet",
    therapeuticClass: "Proton Pump Inhibitor (Antacid)",
    isChronic: true,
    conditionTag: "Acid Reflux / GERD",
    brandedDetails: {
      packSize: 15,
      mrp: 155.00,
      pricePerUnit: 10.33,
      source: "PharmEasy",
      sourceUrl: "https://pharmeasy.in/online-medicine-order/pan-40mg-strip-of-15-tablets-12345",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Pantoprazole Gastro-Resistant Tablets IP 40mg",
      saltComposition: "Pantoprazole Sodium (40mg)",
      packSize: 10,
      primaryPrice: 16.00,
      pricePerUnit: 1.60,
      savingsPercentage: 84.5,
      janAushadhiCode: "PMBJP00215"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Pantoprazole Gastro-Resistant Tablets IP 40mg",
        price: 16.00,
        packSize: 10,
        pricePerUnit: 1.60,
        savingsPercent: 84.5,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.9,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Pantoprazole 40mg Generic Tablets",
        price: 18.00,
        packSize: 10,
        pricePerUnit: 1.80,
        savingsPercent: 82.6,
        inStock: true,
        deliveryDays: "1-2 days",
        rating: 4.6,
        sourceUrl: "https://genericaadhaar.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Zeelab Pharmacy",
        productTitle: "Pantoprazole 40mg Strip (Pack of 10)",
        price: 19.00,
        packSize: 10,
        pricePerUnit: 1.90,
        savingsPercent: 81.6,
        inStock: true,
        deliveryDays: "2 days",
        rating: 4.5,
        sourceUrl: "https://zeelabpharmacy.com",
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    brandName: "Rosuvas 10",
    aliases: ["rosuvas", "rosuvas 10", "rosuvastatin 10", "rozavel 10", "crestor 10"],
    manufacturer: "Sun Pharmaceutical Industries Ltd",
    saltComposition: "Rosuvastatin Calcium (10mg)",
    activeIngredients: [
      { name: "Rosuvastatin Calcium", strength: "10mg", unit: "mg", value: 10 }
    ],
    totalStrength: "10mg",
    dosageForm: "Tablet",
    therapeuticClass: "Statin (Lipid Lowering)",
    isChronic: true,
    conditionTag: "High Cholesterol & Heart Health",
    brandedDetails: {
      packSize: 15,
      mrp: 238.00,
      pricePerUnit: 15.87,
      source: "Tata 1mg",
      sourceUrl: "https://www.1mg.com/drugs/rosuvas-10-tablet-66224",
      lastFetched: new Date().toISOString()
    },
    genericEquivalent: {
      productName: "Rosuvastatin Calcium Tablets IP 10mg",
      saltComposition: "Rosuvastatin Calcium (10mg)",
      packSize: 10,
      primaryPrice: 24.00,
      pricePerUnit: 2.40,
      savingsPercentage: 84.9,
      janAushadhiCode: "PMBJP00523"
    },
    stores: [
      {
        storeName: "Pradhan Mantri Bhartiya Janaushadhi Kendra",
        productTitle: "Rosuvastatin Calcium Tablets IP 10mg (Pack of 10)",
        price: 24.00,
        packSize: 10,
        pricePerUnit: 2.40,
        savingsPercent: 84.9,
        inStock: true,
        deliveryDays: "Store Pickup / Immediate",
        rating: 4.8,
        sourceUrl: "http://janaushadhi.gov.in/ProductList.aspx",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Generic Aadhaar",
        productTitle: "Rosuvastatin 10mg Generic Tablets",
        price: 28.00,
        packSize: 10,
        pricePerUnit: 2.80,
        savingsPercent: 82.4,
        inStock: true,
        deliveryDays: "2 days",
        rating: 4.6,
        sourceUrl: "https://genericaadhaar.com",
        timestamp: new Date().toISOString()
      },
      {
        storeName: "Apollo Pharmacy Generics",
        productTitle: "Rosuvastatin 10mg Generic Strip",
        price: 38.00,
        packSize: 10,
        pricePerUnit: 3.80,
        savingsPercent: 76.1,
        inStock: true,
        deliveryDays: "Same day",
        rating: 4.7,
        sourceUrl: "https://apollopharmacy.in",
        timestamp: new Date().toISOString()
      }
    ]
  }
];

export const MOCK_KENDRA_LOCATIONS = [
  {
    city: "New Delhi",
    lat: 28.6139,
    lng: 77.2090,
    kendras: [
      {
        id: "pmbjp-del-01",
        title: "PMBJP Kendra - AIIMS Ansari Nagar",
        address: "Shop No. 12, Near Metro Gate 2, Ansari Nagar West, New Delhi, Delhi 110029",
        phone: "+91 11 2658 8500",
        rating: 4.8,
        reviewsCount: 342,
        openState: "Open 24 Hours",
        distanceKm: 1.2,
        coordinates: { lat: 28.5672, lng: 77.2100 },
        isJanAushadhi: true,
        stockStatus: "Well Stocked (Over 900 medicines available)",
        directions: {
          travelMode: "Transit / Driving",
          via: "Sri Aurobindo Marg",
          distance: "1.4 km",
          duration: "6 mins",
          steps: [
            "Head south on Sri Aurobindo Marg towards Ring Road",
            "Turn left near Metro Pillar 42 towards AIIMS Gate 2",
            "Jan Aushadhi Kendra is on the left next to Gate 2 entrance"
          ]
        }
      },
      {
        id: "pmbjp-del-02",
        title: "PMBJP Kendra - Connaught Place Outer Circle",
        address: "Block P, Shop 4, Connaught Circus, New Delhi, Delhi 110001",
        phone: "+91 11 2341 4455",
        rating: 4.7,
        reviewsCount: 218,
        openState: "Open · Closes 9:30 PM",
        distanceKm: 2.5,
        coordinates: { lat: 28.6315, lng: 77.2167 },
        isJanAushadhi: true,
        stockStatus: "Cardiac, Diabetic & Antibiotics in stock",
        directions: {
          travelMode: "Driving",
          via: "Janpath Rd",
          distance: "2.8 km",
          duration: "9 mins",
          steps: [
            "Head north on Janpath towards Outer Circle",
            "Take the 2nd exit on the roundabout towards Block P",
            "Destination will be on the right opposite Mohan Singh Place"
          ]
        }
      },
      {
        id: "pmbjp-del-03",
        title: "PMBJP Kendra - Lajpat Nagar IV",
        address: "National Park, Near Metro Station, Lajpat Nagar IV, New Delhi 110024",
        phone: "+91 98112 34567",
        rating: 4.6,
        reviewsCount: 156,
        openState: "Open · Closes 10:00 PM",
        distanceKm: 4.1,
        coordinates: { lat: 28.5684, lng: 77.2433 },
        isJanAushadhi: true,
        stockStatus: "Full range of generic medicines & surgicals"
      },
      {
        id: "chemist-del-01",
        title: "Apollo Pharmacy 24/7 (Branded & Generics)",
        address: "Ring Road, South Extension Part 1, New Delhi 110049",
        phone: "+91 11 4164 1234",
        rating: 4.4,
        reviewsCount: 420,
        openState: "Open 24 Hours",
        distanceKm: 2.1,
        coordinates: { lat: 28.5721, lng: 77.2215 },
        isJanAushadhi: false,
        stockStatus: "Private pharmacy store"
      }
    ]
  },
  {
    city: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    kendras: [
      {
        id: "pmbjp-blr-01",
        title: "PMBJP Kendra - Jayanagar 4th Block",
        address: "11th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
        phone: "+91 80 2244 5566",
        rating: 4.9,
        reviewsCount: 412,
        openState: "Open · Closes 9:30 PM",
        distanceKm: 1.8,
        coordinates: { lat: 12.9299, lng: 77.5824 },
        isJanAushadhi: true,
        stockStatus: "Chronic illness packs available",
        directions: {
          travelMode: "Driving",
          via: "11th Main Rd",
          distance: "2.1 km",
          duration: "8 mins",
          steps: [
            "Proceed south on 11th Main Road towards BDA Complex",
            "Turn right near Cosmo Club",
            "Destination will be on the ground floor next to post office"
          ]
        }
      },
      {
        id: "pmbjp-blr-02",
        title: "PMBJP Kendra - Indiranagar 100ft Rd",
        address: "Near Metro Station, 100 Feet Rd, Indiranagar, Bengaluru 560038",
        phone: "+91 80 2521 8899",
        rating: 4.7,
        reviewsCount: 285,
        openState: "Open · Closes 10:00 PM",
        distanceKm: 3.4,
        coordinates: { lat: 12.9784, lng: 77.6408 },
        isJanAushadhi: true,
        stockStatus: "High stock of BP, Diabetes & Thyroid salts"
      }
    ]
  },
  {
    city: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    kendras: [
      {
        id: "pmbjp-mum-01",
        title: "PMBJP Kendra - Dadar TT Circle",
        address: "Near Dadar Railway Station East, Dadar, Mumbai, Maharashtra 400014",
        phone: "+91 22 2414 7788",
        rating: 4.8,
        reviewsCount: 520,
        openState: "Open · Closes 10:30 PM",
        distanceKm: 1.5,
        coordinates: { lat: 19.0178, lng: 72.8478 },
        isJanAushadhi: true,
        stockStatus: "Complete generic stock available",
        directions: {
          travelMode: "Walking / Transit",
          via: "Dr. Babasaheb Ambedkar Road",
          distance: "1.6 km",
          duration: "7 mins",
          steps: [
            "Head west toward Dadar TT flyover",
            "Take pedestrian subway to Station East",
            "Kendra is located at Shop 3, Municipal Market"
          ]
        }
      },
      {
        id: "pmbjp-mum-02",
        title: "PMBJP Kendra - Andheri West Station",
        address: "Opposite Platform 1, S.V. Road, Andheri West, Mumbai 400058",
        phone: "+91 22 2623 9900",
        rating: 4.6,
        reviewsCount: 310,
        openState: "Open · Closes 10:00 PM",
        distanceKm: 4.2,
        coordinates: { lat: 19.1197, lng: 72.8464 },
        isJanAushadhi: true,
        stockStatus: "All generic formulations available"
      }
    ]
  },
  {
    city: "Hyderabad",
    lat: 17.3850,
    lng: 78.4867,
    kendras: [
      {
        id: "pmbjp-hyd-01",
        title: "PMBJP Kendra - NIMS Hospital Punjagutta",
        address: "Opposite NIMS Hospital, Punjagutta, Hyderabad, Telangana 500082",
        phone: "+91 40 2339 6789",
        rating: 4.9,
        reviewsCount: 460,
        openState: "Open 24 Hours",
        distanceKm: 2.0,
        coordinates: { lat: 17.4222, lng: 78.4528 },
        isJanAushadhi: true,
        stockStatus: "Complete inventory of generic medicines"
      }
    ]
  },
  {
    city: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    kendras: [
      {
        id: "pmbjp-chn-01",
        title: "PMBJP Kendra - T Nagar Ranganathan St",
        address: "Near Usman Road Junction, T Nagar, Chennai, Tamil Nadu 600017",
        phone: "+91 44 2434 5566",
        rating: 4.8,
        reviewsCount: 380,
        openState: "Open · Closes 9:30 PM",
        distanceKm: 2.3,
        coordinates: { lat: 13.0418, lng: 80.2341 },
        isJanAushadhi: true,
        stockStatus: "Fully stocked"
      }
    ]
  },
  {
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    kendras: [
      {
        id: "pmbjp-kol-01",
        title: "PMBJP Kendra - Medical College College St",
        address: "Opposite Calcutta Medical College, 88 College St, Kolkata 700073",
        phone: "+91 33 2241 8899",
        rating: 4.7,
        reviewsCount: 410,
        openState: "Open · Closes 9:00 PM",
        distanceKm: 1.7,
        coordinates: { lat: 22.5735, lng: 88.3619 },
        isJanAushadhi: true,
        stockStatus: "Full range available"
      }
    ]
  },
  {
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    kendras: [
      {
        id: "pmbjp-pune-01",
        title: "PMBJP Kendra - Kothrud Karve Road",
        address: "Near Mayur Colony, Karve Road, Kothrud, Pune, Maharashtra 411038",
        phone: "+91 20 2544 3322",
        rating: 4.8,
        reviewsCount: 295,
        openState: "Open · Closes 9:30 PM",
        distanceKm: 2.1,
        coordinates: { lat: 18.5074, lng: 73.8077 },
        isJanAushadhi: true,
        stockStatus: "High stock of cardiac and diabetic medicines"
      }
    ]
  }
];

export const SAMPLE_STRIP_PHOTOS = [
  {
    id: "sample-augmentin",
    title: "Augmentin 625 Duo Blister Strip",
    detectedMedicine: "Augmentin 625 Duo",
    detectedSalt: "Amoxicillin and Potassium Clavulanate Tablets IP",
    confidence: 0.98,
    imageUrl: "/samples/sample-augmentin.svg",
    description: "Amoxicillin 500mg + Potassium Clavulanate 125mg IP"
  },
  {
    id: "sample-glycomet",
    title: "Glycomet 500 Strip",
    detectedMedicine: "Glycomet 500",
    detectedSalt: "Metformin Hydrochloride Tablets IP 500mg",
    confidence: 0.97,
    imageUrl: "/samples/sample-glycomet.svg",
    description: "Metformin Hydrochloride Prolonged-Release Tablets IP 500mg"
  },
  {
    id: "sample-telma",
    title: "Telma 40 Blister Strip",
    detectedMedicine: "Telma 40",
    detectedSalt: "Telmisartan Tablets IP 40mg",
    confidence: 0.96,
    imageUrl: "/samples/sample-telma.svg",
    description: "Telmisartan Tablets IP 40mg"
  },
  {
    id: "sample-thyronorm",
    title: "Thyronorm 50 Bottle/Strip",
    detectedMedicine: "Thyronorm 50 mcg",
    detectedSalt: "Thyroxine Sodium Tablets IP 50mcg",
    confidence: 0.95,
    imageUrl: "/samples/sample-thyronorm.svg",
    description: "Thyroxine Sodium Tablets IP 50mcg"
  },
  {
    id: "sample-pan",
    title: "Pan 40 Gastro-Resistant Strip",
    detectedMedicine: "Pan 40",
    detectedSalt: "Pantoprazole Gastro-Resistant Tablets IP 40mg",
    confidence: 0.97,
    imageUrl: "/samples/sample-pan.svg",
    description: "Pantoprazole Sodium 40mg"
  }
];
