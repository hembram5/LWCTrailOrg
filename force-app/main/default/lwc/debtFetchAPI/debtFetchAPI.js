import { LightningElement } from 'lwc';

export default class DebtFetchAPI extends LightningElement {
    data = [];
    columns;
    count;
    totalAmount = 0;
    selectedRecords = 0;
    selectedRecordToRemove = [];
    openModal = false;

    /**
     * connectedCallback is executed when the component is inserted into DOM. Connected callback runs once when the component is inserted.
     */
    connectedCallback() {
        this.handleFetch();
        let executed = false;
        setInterval(() => {
            if(!executed) {
                executed = true;
                this.calculateBalance();
            }
        }, 1000 * 1);
    }

    /**
     * get data from endpoint url
     */
    async handleFetch() {
        let endPoint = "https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json";
        const response = await fetch(endPoint);
        const repos = await response.json();
        this.data = repos;
        this.count = repos.length;
        const fields = [
            {label: 'Creditor', fieldName: 'creditorName', type: 'text'},
            {label: 'First Name', fieldName: 'firstName', type: 'text'},
            {label: 'Last Name', fieldName: 'lastName', type: 'text'},
            {label: 'Min Pay %', fieldName: 'minPaymentPercentage', type: 'number'},
            {label: 'Balance', fieldName: 'balance', type: 'currency'}
        ];
        this.columns = fields;
    }

    /**
     * Below function is used to get the selected records
     */
     getSelectedRow(event) {
        const selectedRow = event.detail.selectedRows;
        const setRows = [];
        this.selectedRecords = selectedRow.length;
        for (let i = 0; i < selectedRow.length; i++) {
            setRows.push(selectedRow[i].id);   
        }
        this.selectedRecordToRemove = setRows;
     }

     /**
     * Below method is used to open pop-up modal
     */
    addDebt() {
        this.openModal = true;
    }

    /**
     * Below method is used to save the debt record
     */
    handleSave() {
        let newCount = this.count + 1;
        const inputCreditor = this.template.querySelector('.creditor');
        const inputFirstName = this.template.querySelector('.firstName');
        const inputlastName = this.template.querySelector('.lastName');
        const inputMinPay = this.template.querySelector('.minPay');
        const inputBalc = this.template.querySelector('.balc');
        this.openModal = false;
        this.data = [...this.data, {"id":newCount,"creditorName":inputCreditor.value,"firstName":inputFirstName.value,"lastName":inputlastName.value,"minPaymentPercentage":inputMinPay.value,"balance":inputBalc.value}];
        this.count = this.data.length;
        this.totalAmount = parseFloat(this.totalAmount) + parseFloat(inputBalc.value);
    }

    /**
     * Below method is used to remove the data from array
     */
    removeDebt() {
        this.data.forEach(element => {
            this.selectedRecordToRemove.forEach(elementData => {
                if (element.id === elementData) {
                    this.data = this.data.splice(0,(elementData - 1));
                    this.count = this.data.length;
                    this.totalAmount -= parseFloat(element.balance);
                }
            });
        });
     }

    /**
     * Below method is used to close the modal-box
     */
    handleCancel(event) {
       this.openModal = false;
    }

    /**
     * Below method is used to call the balance
     */
    calculateBalance() {
        this.data.forEach(element => {
            this.totalAmount += parseFloat(element.balance);
        });
    }
}