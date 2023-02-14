

// Unit Test Code: 
import { EnrollModel } from './EnrollModel';

describe('EnrollModel', () => {
    let enrollData;

    beforeEach(() => {
        enrollData = {
            city: 'New York', 
            motorcycle: { brand: 'Honda', model: 'CBR' }, 
            use: 'Personal', 
            terms: { responsibility: true, lgpd: true } 
        };
    });

    describe('validate()', () => {

        it('should throw an error if missing required property', () => {
            delete enrollData.city;

            expect(() => EnrollModel.validate(enrollData)).toThrowError(['.city']); // missing property city should be thrown as an error in the array of errors 
        });

        it('should not throw an error if all required properties are present', () => {            

            expect(() => EnrollModel.validate(enrollData)).not.toThrowError(); // no errors should be thrown because all required properties are present 
        });

    });

    describe('find()', () => {

        it('should return null if no enrollment is found with the given id', async () => {            

            const enroll = await EnrollModel.find('123'); // passing a random id that does not exist in the database 

            expect(enroll).toBeNull(); // enrollment should be null because no enrollment was found with the given id  
        });

    });    

    describe('getAll()', () => {        

        it('should return an array of enrollments when successful', async () => {            

            const enrollments = await EnrollModel.getAll(); // get all enrollments from the database  

            expect(Array.isArray(enrollments)).toBeTruthy(); // should return an array of enrollments when successful  
        });        

    });    

    describe('getAllPaginated()', () => {        

        it('should return an array of paginated enrollments when successful', async () => {            

            const limit = 10; // set a limit for 10 items per page 
            const startKey = 0; // start at
        }
    }
});