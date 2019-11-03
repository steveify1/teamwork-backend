const globalSpec = require("./index.spec");
const { allFieldsEmpty, noFirstName, noLastName, noEmail, noPassword, noGender, noJobRole, noDepartment, noAddress } = require("./mockData/signUpMock");


globalSpec('POST /auth/signup', (request, baseUrl) => {

    // it('should return a 201 status when all required conditions are satisfied', (done) => {
    //     request.post({
    //         uri: `${baseUrl}/api/v1/auth/create-user`,
    //         json: true,
    //         body: noPassword
    //     }, (error, response, body) => {
    //         expect(response.statusCode).toEqual(201);
    //         expect(body.error).toBe("Missing data field(s)");
    //         done();
    //     });
    // });

    it('should return a 400 status when password is not sent', (done) => {
        request.post({
            uri: `${baseUrl}/api/v1/auth/create-user`,
            json: true,
            body: noPassword
        }, (error, response, body) => {
            expect(response.statusCode).toEqual(400);
            expect(body.error).toBe("Missing data field(s)");
            done();
        });
    });

    // it('should return a 400 status when the email already exists', (done) => {
    //     request.post({
    //         uri: `${baseUrl}/api/v1/auth/create-user`,
    //         json: true,
    //         body: noPassword
    //     }, (error, response, body) => {
    //         expect(response.statusCode).toEqual(402);
    //         expect(body.error).toBe("Email already exists");
    //         done();
    //     });
    // });
});
