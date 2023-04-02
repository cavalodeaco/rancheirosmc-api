import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
const enrollments = [
  {
    user: {
      name: "John Smith",
      email: "john.smith@gmail.com",
      phone: "(415) 555-1234",
      driverLicense: "1234567389",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "cambira",
      motorcycle: {
        brand: "Harley Davidson",
        model: "Sportster",
      },
      use: "commute",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Maria Rodriguez",
      email: "maria.rodriguez@gmail.com",
      phone: "(305) 555-6789",
      driverLicense: "9876534321",
      driverLicenseUF: "FL",
    },
    enroll: {
      city: "cambira",
      motorcycle: {
        brand: "Ducati",
        model: "Monster",
      },
      use: "lazer",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "David Lee",
      email: "david.lee@gmail.com",
      phone: "(212) 555-4321",
      driverLicense: "4567839123",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "londrina",
      motorcycle: {
        brand: "Honda",
        model: "CB500X",
      },
      use: "commute",
      terms: {
        responsibility: false,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "John Doe",
      email: "johndoe@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "1234536789",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "maringa",
      motorcycle: {
        brand: "Harley-Davidson",
        model: "Sportster",
      },
      use: "commuting",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "9876354321",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "londrina",
      motorcycle: {
        brand: "Honda",
        model: "CB500F",
      },
      use: "pleasure",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Tom Johnson",
      email: "tomjohnson@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "9876543321",
      driverLicenseUF: "TX",
    },
    enroll: {
      city: "Austin",
      motorcycle: {
        brand: "BMW",
        model: "R 1200 GS",
      },
      use: "adventure",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Sophie Garcia",
      email: "sophiegarcia@gmail.com",
      phone: "(123) 456-7890",
      driverLicense: "A12334567",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "Los Angeles",
      motorcycle: {
        brand: "Harley-Davidson",
        model: "Sportster",
      },
      use: "commuting",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Emily Jones",
      email: "emilyjones@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "12345637890",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "curitiba",
      motorcycle: {
        brand: "Harley Davidson",
        model: "Street Glide",
      },
      use: "commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Sophia Martinez",
      email: "sophiamartinez@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "09873654321",
      driverLicenseUF: "FL",
    },
    enroll: {
      city: "curitiba",
      motorcycle: {
        brand: "Honda",
        model: "CBR 600",
      },
      use: "racing",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "David Kim",
      email: "davidkim@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "6543210987",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Ducati",
        model: "Monster",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "David Kim",
      email: "davidkim@gmail.com",
      phone: "(555) 555-1212",
      driverLicense: "6543210987",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Ducati",
        model: "Monster",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Evelyn Chen",
      email: "evelynchen@gmail.com",
      phone: "(555) 555-5555",
      driverLicense: "1234567890",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "Los Angeles",
      motorcycle: {
        brand: "Harley Davidson",
        model: "Softail",
      },
      use: "weekend joyride",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Maria Rodriguez",
      email: "mariarodriguez@gmail.com",
      phone: "(555) 555-1234",
      driverLicense: "0987654321",
      driverLicenseUF: "FL",
    },
    enroll: {
      city: "Miami",
      motorcycle: {
        brand: "Honda",
        model: "CBR600RR",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Robert Lee",
      email: "robertlee@gmail.com",
      phone: "(555) 555-6789",
      driverLicense: "9876543210",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "San Francisco",
      motorcycle: {
        brand: "Kawasaki",
        model: "Ninja ZX-10R",
      },
      use: "track racing",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Oliver Jones",
      email: "oliverjones@gmail.com",
      phone: "(555) 555-7777",
      driverLicense: "1111111111",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Yamaha",
        model: "YZF-R1",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Sophia Patel",
      email: "sophiapatel@gmail.com",
      phone: "(555) 555-2222",
      driverLicense: "2222222222",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "San Francisco",
      motorcycle: {
        brand: "Ducati",
        model: "Diavel 1260S",
      },
      use: "weekend joyride",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Ava Nguyen",
      email: "ava.nguyen@gmail.com",
      phone: "(555) 555-3333",
      driverLicense: "3333333333",
      driverLicenseUF: "TX",
    },
    enroll: {
      city: "Houston",
      motorcycle: {
        brand: "Honda",
        model: "CBR1000RR",
      },
      use: "track racing",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Ethan Kim",
      email: "ethankim@gmail.com",
      phone: "(555) 555-4444",
      driverLicense: "4444444444",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "San Francisco",
      motorcycle: {
        brand: "BMW",
        model: "R 1250 GS Adventure",
      },
      use: "off-road adventure",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Emma Rodriguez",
      email: "emmarodriguez@gmail.com",
      phone: "(555) 555-5555",
      driverLicense: "5555555555",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Harley Davidson",
        model: "Road Glide Special",
      },
      use: "long distance touring",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "William Lee",
      email: "williamlee@gmail.com",
      phone: "(555) 555-6666",
      driverLicense: "6666666666",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "Los Angeles",
      motorcycle: {
        brand: "Yamaha",
        model: "YZF-R6",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Olivia Kim",
      email: "oliviakim@gmail.com",
      phone: "(555) 555-7777",
      driverLicense: "7777777777",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Kawasaki",
        model: "Ninja H2 SX SE",
      },
      use: "highway cruising",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Emily Lee",
      email: "emilylee@gmail.com",
      phone: "(555) 555-3333",
      driverLicense: "3333333333",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "BMW",
        model: "R NineT",
      },
      use: "commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Jacob Rodriguez",
      email: "jacobrodriguez@gmail.com",
      phone: "(555) 555-4444",
      driverLicense: "4444444444",
      driverLicenseUF: "TX",
    },
    enroll: {
      city: "Houston",
      motorcycle: {
        brand: "Harley Davidson",
        model: "Road King",
      },
      use: "weekend joyride",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Avery Nguyen",
      email: "averynguyen@gmail.com",
      phone: "(555) 555-5555",
      driverLicense: "5555555555",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "San Francisco",
      motorcycle: {
        brand: "Indian",
        model: "Scout",
      },
      use: "daily commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
  {
    user: {
      name: "Olivia Hernandez",
      email: "oliviahernandez@gmail.com",
      phone: "(555) 555-6666",
      driverLicense: "6666666666",
      driverLicenseUF: "NY",
    },
    enroll: {
      city: "New York",
      motorcycle: {
        brand: "Triumph",
        model: "Street Scrambler",
      },
      use: "weekend joyride",
      terms: {
        responsibility: true,
        lgpd: false,
      },
    },
  },
  {
    user: {
      name: "Ethan Kim",
      email: "ethankim@gmail.com",
      phone: "(555) 555-7777",
      driverLicense: "7777777777",
      driverLicenseUF: "CA",
    },
    enroll: {
      city: "San Francisco",
      motorcycle: {
        brand: "Yamaha",
        model: "MT-07",
      },
      use: "commute",
      terms: {
        responsibility: true,
        lgpd: true,
      },
    },
  },
];

async function teste() {
  // loop through enrollments
  for (const enroll of enrollments) {
    const r = await fetch(`${process.env.DEV_AWS_API_GATEWAY_URL}/enroll`, {
      method: "POST",
      body: JSON.stringify(enroll),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(r.status, r.statusText, r.text());

    // sleep 2 minutes
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
teste();
