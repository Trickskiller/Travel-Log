import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [MessageService]

})
export class RegisterPage implements OnInit {
  submitted: boolean = false;
  formulaires!: any;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private messageService: MessageService,
    private router: Router,
    private toastController: ToastController
      ) {}

  ngOnInit() {
    this.formulaires = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],


    });
  }
  get userName() {
    return this.formulaires.get('name');
  }


  get password() {
    return this.formulaires.get('password');
  }

   async save() {
    if (this.formulaires.invalid) {
      this.formulaires.markAllAsTouched();
    } else {
      this.submitted = true;
      this.service.create(this.formulaires.value).subscribe({
        next: (value) => {},
        error: (err) => {console.error('Observable emitted an error: ' + err), this.submitted = false},
        complete: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compte crée avec succés' });
          this.submitted = false;
          this.presentToast();
          this.router.navigate(['/login']);
        },
      });
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Compte crée avec succés!',
      duration: 1500,
      position: "top",
    });

    await toast.present();
  }
}
