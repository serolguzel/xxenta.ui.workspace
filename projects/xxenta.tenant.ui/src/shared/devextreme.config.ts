import config from 'devextreme/core/config';


export function configureDevExtremeLicense() {
    config({
        licenseKey: 'DEVELOPER_LICENSE_KEY',
        defaultCurrency: 'EUR'
    });
}