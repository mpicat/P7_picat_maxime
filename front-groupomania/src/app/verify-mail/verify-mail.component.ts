import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';

@Component({
  selector: 'app-verify-mail',
  templateUrl: './verify-mail.component.html',
  styleUrls: ['./verify-mail.component.scss']
})
export class VerifyMailComponent implements OnInit {

  constructor(private service: ApiserviceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const confirmToken = this.route.snapshot.params['confirmationToken'];
    this.verifyUser(confirmToken);
  }

  // verify mail
  verifyUser(confirmToken: string) {
    this.service.verify(confirmToken).subscribe((res) => {
      console.log("Mail confirmé");
    });
  }
}
