import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { PlaceService } from 'src/app/services/place.service';
import { ObjectService } from 'src/app/services/object.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  id!: any;
  data: any;
  temp: any;
  tempo: any={};
  visible: boolean = false;
  editvisible: boolean = false;
  state: boolean = false;
  deletesubmitted: boolean = false;
  submitted: boolean = false;
  psubmitted: boolean = false;
  esubmitted: boolean = false;

  userDialog: boolean = false;
  temporaile: any ={};
  buttonValue = 'grid';
  buttonItems: any[] = [];
  posts: any[] = [];
  profile!: any;
  formulaires!: any;
  project!: any;
  randomColor!: string;
  deleted: boolean = false;
  listvisible: boolean = false;
  place!:any;
  form!:any;
  stateOptions2: any[] = [
    { label: 'Profil', value: 'profil' },
    { label: 'Réglage', value: 'setting', constant: true }
];
value2: string = 'profil';

  constructor(private service: UserService, private fb: FormBuilder,    private toastController: ToastController,
    private log: AuthentificationService, private placeservice: PlaceService,    private services: ObjectService,
    ) {}

  async ngOnInit() {
    this.temp = localStorage.getItem('id');
    this.id = JSON.parse(this.temp);
    this.getAllProjectForUser();

    this.formulaires = this.fb.group({
      _id: ['', Validators.required],
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.form =  this.fb.group({
      id: ['', Validators.required],
      name: ["", Validators.required],
    });

    this.buttonItems = [{ value: 'grid', icon: 'grid' }];
  }



  edit(data: any) {

    this.temporaile = { ...data };
    this.userDialog = true;
}

  get user() {
    return this.form.get('name');
  }
  get userName() {
    return this.formulaires.get('userName');
  }
  get firstName() {
    return this.formulaires.get('firstName');
  }
  get lastName() {
    return this.formulaires.get('lastName');
  }
  get email() {
    return this.formulaires.get('email');
  }
  modifier(){
   if(this.formulaires.invalid){
    this.formulaires.markAllAsTouched();

   }else{
    this.state = true;
    this.service.update(this.formulaires.value).subscribe({
      next: (value) => {

        console.log(value);
      },
      error: (err) => {
        console.error('Observable emitted an error: ' + err),
          (this.state = false);
      },
      complete: () => (this.state = false, this.temporaile = {} , this.ngOnInit(),     this.userDialog = false , this.presentToast("Compte supprimé avec Succés")    ),
    });
   }
  }

  getAllProjectForUser() {
    this.submitted = true;
    this.service.getById(this.id).subscribe({
      next: (value) => {
        (this.project = value), console.log(this.project);
      },
      error: (err) => {
        console.error('Observable emitted an error: ' + err),
          (this.submitted = false);
      },
      complete: () => (this.submitted = false),
    });
  }
  deleteProfile() {
    this.deletesubmitted = true;
    this.service.deleteP(this.id).subscribe({
      next: (value) => {
        console.log(value);
      },
      error: (err) => {
        console.error('Observable emitted an error: ' + err),
          (this.deletesubmitted = false);
      },
      complete: () => {this.deletesubmitted = false,this.visible=false,this.presentToast("votre compte a été supprimé avec succées"), this.log.logout()},
    });
  }
  logout(){
    this.log.logout()
  }

  async presentToast(message:any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "top",
    });

    await toast.present();
  }



  edited(){
    console.log(this.form.value);
    if(this.form.invalid){
      this.form.markAllAsTouched();


    }else{
      this.esubmitted = true;
      this.service.updates(this.form.value).subscribe({
        next: (value:any) => {
          localStorage.setItem("userName", JSON.stringify(value.name));
          this.presentToast("profile modifié avec succés")
        },
        error: (err) => {console.error('Observable emitted an error: ' + err), this.esubmitted = false},
        complete: () => {this.esubmitted = false,  this.tempo = {};
        this.editvisible = false, this.ngOnInit()},
      });
    }


  }

showDialogs(data: any) {
  this.tempo ={...data}
  this.editvisible = true;

}
}
