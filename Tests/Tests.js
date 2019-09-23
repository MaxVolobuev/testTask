tests = require('../constants/constants');

// first parameter - suit name
// second parameter - function (function will have all tests (it blocks))
describe('Authorization page', function() {
    const email = 'ssls.automation+666@gmail.com';
    const password = 123456;
    const supportPin = element(by.name('form')).all(by.className('text ng-binding'));
    const triangle = element(by.className('btn btn-s round filled dropdown-btn ng-isolate-scope'));
    const profileButton = element(by.linkText('View profile'));


    function homeAndAuthorizationPages() {
        const logBox = element(by.className('btn flat-dark ng-scope'));
        const homePage = element(by.className('btn control block round'));
        const authorizationPage = element(by.className('page-title'));
        //Ensure that user can get home page
        expect(homePage.getText()).toBe('PERSONAL');
        //Click Log in log-box
        logBox.click();
        //Check the elements on Authorization page
        expect(authorizationPage.getText()).toBe('Authorization');
    }

    async function loginAndVerification(login, pass) {
        const loginButton = element(by.buttonText('Login'));
        const iconEye = element(by.className('icon icon-eye'));
        const emailField = element(by.model('form.email'));
        const passField = element(by.model('form.password'));
        //Enter email and password then click view password and ensure that it visible and
        // after Click LOGIN button and ensure that user did it successfully
        emailField.sendKeys(login);
        passField.sendKeys(pass);
        await iconEye.click();
// Ensure that user can see text
        expect(await passField.getAttribute("type")).toEqual("text");

        loginButton.click();
    }


    function logout() {
        const logoutButton = element(by.buttonText('Log out'));
        //Click on Logout button
        triangle.click();
        logoutButton.click();

        expect(browser.getCurrentUrl()).toEqual("https://www.sbzend.ssls.com/authorize");
    }

    // function profile() {
    //     homeAndAuthorizationPages();
    //     loginAndVerification(email, password);
    //     triangle.click();
    //     profileButton.click();
    // }

    beforeEach(function () {
        //here can be smth before each spec
        browser.get('https://www.sbzend.ssls.com');
    });
    afterEach(function () {
        //here can be smth after each it blocks
        browser.manage().deleteAllCookies();
    });

    //Each it block will be called as a spec
// first parameter - test case name
    // second - function
    // Each it block will be called as a spec


     it('(1 Welcome back!)', async function () {
        const ensureThatUserAuthorizated = element(by.className('btn btn-s round filled user-btn ng-binding'));

        homeAndAuthorizationPages();
        loginAndVerification(email, password);

        expect(await ensureThatUserAuthorizated.getText()).toBe('ssls.automation+666@gmail.com');
        });

    it('2 Invalid email',async function () {
            const invalidEmail = element(by.className('tooltip-text'));

            homeAndAuthorizationPages();
            loginAndVerification('email', password);

            expect(await invalidEmail.getText()).toEqual("Uh oh! This\n" +
                "isn’t an email");
    });

    it('3 Not registered user', function () {
            const loginAlert = element(by.className('noty_text'));

            homeAndAuthorizationPages();
            loginAndVerification(email + 1, password);
            loginButton.click().then(function () {
                expect(loginAlert.getAttribute('innerText')).toEqual("Uh oh! Email or password is incorrect");
            })
    });

    it('4 Empty fields', async function() {
        const emptyEmail = element(by.xpath('//!*[@id="ng-app"]/body/div[1]/div/ui-view/div/ng-include/div/div/form/div[1]/div/div[2]/div/div[1]/span'));
        const emptyPassword = element(by.xpath('//!*[@id="ng-app"]/body/div[1]/div/ui-view/div/ng-include/div/div/form/div[2]/div/div[2]/div/div[1]/span'));

        homeAndAuthorizationPages();
        loginAndVerification('', '');

        expect (await emptyEmail.getText()).toEqual('Oops, please\n'+
            'enter your email');
        expect (await emptyPassword.getText()).toEqual('Looks like you’ve\n' +
            'missed this one');
    });

    it('5 Logout', function () {
        homeAndAuthorizationPages();
        loginAndVerification(email, password);
        logout();
    });

    it('6 Client area', async function () {
        const allElements2 = 'Vasya Pupkin; ssls.automation+666@gmail.com; *****; +380 57123456789; Diagon alley 2, Misto, Uryupinsk 612120, Ukraine; 1yg2';

        homeAndAuthorizationPages();
        loginAndVerification(email, password);
        triangle.click();
        await profileButton.click();

        //Convert String to Array for next comparing
        const absSplit = allElements2.split('; ');

        expect(await supportPin.getText()).toEqual(absSplit);
    });

    it('7 Refresh support pin', async function () {
        homeAndAuthorizationPages();
        loginAndVerification(email, password);
        triangle.click();

        await profileButton.click();
        const oldPin = await supportPin.get(5).getText();
        await pinRefreshButton.click();
        const getNewPin = element(by.name('form')).all(by.className('text ng-binding'));
        const newPin = await getNewPin.get(5).getText();

        expect(oldPin).not.toEqual(newPin);
    });


    // This test case isn't working, described the main logic
    /*it('8.3 Filter. Sorting.', async function () {
        const filterButton = element.all(by.xpath('//!*[@id="certs"]/div[3]/div/a'));
        const allSSLList = element.all(by.xpath("//div[@class='ssl-price-box']//price[not(@old-price)]"));

        await filterButton.click();
        await allSSList.getAttribute('value');
        //Convert no numbers
        allSSLList.map(Number);
        //Copy all elements to new variable
      const sortedSSLList = allSSLList.slice();
        //Sort array
        sortedSSLList.sort();

        expect(await allSSLList).toEqual(sortedSSLList);
    });*/
});


