// Legacy PPV migration script
import csv from 'csv-parser';
import { createReadStream } from 'fs';

const enrollments = []

// Read a csv file and fill the object with the data
// csv pattern: legacy_date,user.name,user.email,user.phone,user.driverLicense,user.driverLicenseUF,enroll.city,enroll.motorcycle.brand,enroll.motorycle.model,enroll.use,terms.responsability,terms.lgpd,terms.authorization

createReadStream('../../../../Documents/LRMC/PPV/Legacy/north_parana_legacy.csv')
    .pipe(csv())
    .on('data', (row) => {
        enrollments.push({
            "user": {
                "name": row["user.name"],
                "email": row["user.email"],
                "phone": row["user.phone"],
                "driverLicense": row["user.driverLicense"],
                "driverLicenseUF": row["user.driverLicenseUF"]
            },
            "enroll": {
                "city": row["enroll.city"],
                "motorcycle": {
                    "brand": row["enroll.motorcycle.brand"],
                    "model": row["enroll.motorycle.model"]
                },
                "use": row["enroll.use"],
                "terms": {
                    "responsability": row["terms.responsability"],
                    "lgpd": row["terms.lgpd"],
                    "authorization": row["terms.authorization"]
                },
                "legacy": {
                    "status": row["status"]=="#N/A" ? "waiting" : row["status"],
                    "date": row["legacy_date"]
                }
            }
        })
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        console.log(enrollments[1]);
    });
