import { Component, VERSION } from '@angular/core';
import { TableService } from '../../app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tableData = [];
  displayedColumns = [
    'Check',
    'DueDate',
    'SupplierName',
    'Invoice',
    'VoucherNo',
    'PaymentAmount',
    'Status'
  ];
  dispalayicons = {
    New: 'assets/newicon.svg',
    Rejected: 'assets/rejectedicon.svg',
    Error: 'assets/erroricon.svg',
    PartialPending: 'assets/partialpendingapprovalicon.svg',
    Partial: 'assets/partialicon.svg',
    Registered: 'assets/registeredicon.svg',
    Pending: 'assets/overdueicon.svg',
    Logo: 'assets/logoicon.svg',
    Person: 'assets/personicon.svg'
  };
  selectedrows = [];
  rowcount = 0;
  allselected = false;
incompletepayments: number=0;
  constructor(private service: TableService) {
    this.service.getTableData().subscribe(
      (data: any) => {
        this.tableData = data['invoices'];
      },
      err => {},
      () => {
        this.checkstatus();
      }
    );
  }
  checkstatus() {
    this.tableData.forEach(invoice => {
      if (
        invoice.EntryAmount == invoice.Amount &&
        invoice.Payments.length > 0 &&
        invoice.Payments[0].BookkeepingStatus == 2
      ) {
        invoice.Status = 'Rejected';
        this.rowcount += 1;
      } else if (Object.keys(invoice.Errors).length > 0) {
        invoice.Status = 'Error';
      } else if (this.checkpayments(invoice.Payments)) {
        invoice.Status = 'PartialPending';
        invoice.StatusDetails=this.incompletepayments+" partial payment registered on this invoice"
        this.rowcount += 1;
      } else if (
        invoice.EntryAmount != invoice.Amount &&
        invoice.Amount != 0 &&
        invoice.Payments[0].BookkeepingStatus != 2
      ) {
        invoice.Status = 'Partial';
        this.rowcount += 1;
      } else if (invoice.Amount == 0 && this.checkpay(invoice)) {
        invoice.Status = 'Registered';
      } else if (
        invoice.Amount == invoice.EntryAmount &&
        invoice.Payments.length == 0
      ) {
        invoice.Status = 'New';
        this.rowcount += 1;
      }
    });
  }
  checkpayments(inv) {
    this.incompletepayments = 0;
    var status = false;
    for (let x = 0; x < inv.length; x++) {
      if (inv[x].BookkeepingStatus == 1) {
        this.incompletepayments += 1;
        status = true;
      }
    }
    return status;
  }
  checkpay(invit) {
    var totalpayments = 0;
    invit.Payments.forEach(x => {
      totalpayments += x.Amount;
    });
    if (totalpayments == invit.EntryAmount) {
      return true;
    }
    return false;
  }
  toggle(row) {
    if(row.Status=="Error"||row.Status=="Registered"){
      return;
    }
    if (this.selectedrows.includes(row)) {
      this.selectedrows.splice(this.selectedrows.indexOf(row), 1);
    } else {
      this.selectedrows.push(row);
    }
    if (this.selectedrows.length == this.rowcount) {
      this.allselected = true;
    } else {
      this.allselected = false;
    }
  }
  toggleAll() {
    if (this.allselected) {
      this.allselected = false;
      this.selectedrows = [];
    } else {
      this.selectedrows = this.tableData.filter(x => {
        if (x.Status != 'Error' && x.Status != 'Registered') {
          return true;
        }
      });
      this.allselected = true;
    }
  }
}
