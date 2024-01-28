import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ObjectService } from 'src/app/services/object.service';
import { PopoverController, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { Router } from '@angular/router';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
})
export class AccueilComponent  implements OnInit {
  formulaires!: any;
  submitted: boolean = false;
  deleted: boolean = false;
  data!: any;
  backup!: any;
  formulaire!: any;
  form!: any;
  temporaile: any ={};
  role!: string;
  userId!: string;
  randomColor!: string;
  objectDialog: boolean = false;
  products!: any[];
  layout: string = 'list';
  userName!: string;
  isModalOpen = false;
  isModalOpens = false;
  isFilter= false;
  temp: any = {};
  lieu:any;
  range:any;
  temps!: any;
  id!: any;
  justifyOptions: any[] = [
    { icon: 'pi pi-align-justify', justify: 'Left' , value:"list"},
    { icon: 'pi pi-table', justify: 'Right', value: "grid" },

];
trips = [
  { id: 1, name: 'Banjir Kanal', category: 'Camp', image: 'assets/imgs/banjir.jpg', price: '12K' },
  { id: 2, name: 'Swiss Alps', category: 'Mountains', image: 'assets/imgs/swissalps.jpg', price: '20K' },
  { id: 3, name: 'Adi Kailash', category: 'Treking', image: 'assets/imgs/kailash.jpg', price: '5K' },
  { id: 4, name: 'Tarsar Lake', category: 'Lake', image: 'assets/imgs/tarsar.jpg', price: '15K' },
];
  state: boolean = false;
  public pages: any[] = [
    {title: 'Voyage', url: '/home/home', icon: 'airplane'},

    {title: 'Compte', url: '/home/profile', icon: 'person'},

    {title: 'Deconnexion', url: '', icon: 'log-out', route: true},
  ];
  constructor(
    private fb: FormBuilder,
    private service: ObjectService,
    public popoverController: PopoverController,
    private log: AuthentificationService,
    private toastController: ToastController,
    private router: Router,
    private placeservice: PlaceService,



  ) {


  }

  ngOnInit() {
    this.temps = localStorage.getItem('id');
    this.id = JSON.parse(this.temps);
    this.formulaire = this.fb.group({
      _id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      picture: ['', Validators.required],
      userId: ['', Validators.required],
      placeId: ['', Validators.required],
      isFound: [false],

    });
    this.form =  this.fb.group({
      _id: ['', Validators.required],
      isFound: [false, Validators.required],
    });

    this.getAllObject();
    this.randomColor = this.service.generateRandomColor();
    this.role = this.log.role;
    this.userId = this.log.id;
    this.userName = JSON.parse(this.log.userName)
  }


  get description() {
    return this.formulaire.get('description');
  }

  get name() {
    return this.formulaire.get('name');
  }
  get picture() {
    return this.formulaire.get('picture');
  }
  get userIds() {
    return this.formulaire.get('userId');
  }
  get placeId() {
    return this.formulaire.get('placeId');
  }
  get isFound() {
    return this.formulaire.get('isFound');
  }
 setOpen(data:any){
  this.isModalOpen = false;
  this.isModalOpens = false;
  this.temp = {};
  this.temp = {...data}
  console.log(this.temp)
  this.isModalOpen = true;
 }
 retour(){
  this.isModalOpens = false;
  this.ngOnInit();
 }
  getAllObject() {

      this.submitted = true;
      this.placeservice.getAllO().subscribe({
        next: (value) => {this.backup = value,
          this.data= value;
          console.log(value)

        const obj:any = {}
        this.data = this.data.filter((item:any) => item.trip.userId === this.id);

        for (var i = this.data.length - 1; i >= 0; i--) {
          const place = Object.assign({}, this.data[i])
          const { trip } = place
          delete place.trip
          const subObject = obj[trip?.id] || {...trip}
              const placeInObject = subObject?.places || []
              placeInObject.push(place)
              subObject.places = placeInObject
              obj[trip?.id] = subObject
        }
        this.data = Object.values(obj);
        this.backup = Object.values(obj);
        console.log(this.data)
        },
        error: (err) => {console.error('Observable emitted an error: ' + err), this.submitted = false},
        complete: () => (this.submitted = false),
      });
  }
  changeState(object:any, state:any){
    this.form.patchValue({
      _id: object._id,
      isFound: state
    })

    this.service.update(this.form.value).subscribe({
      next: (value) => {

      },
      error: (err) => {
        console.error('Observable emitted an error: ' + err),
          (this.state = false);
          this.presentToast("Nous rencontrons une erreur")
      },
      complete: () => (this.presentToast("Object modifié  avec Succés")    ),
    });
  }


  details(id:string){
    this.router.navigateByUrl(`/home/details/${id}`)
    this.popoverController.dismiss();
  }
  delete(){

    this.deleted = true;
    this.service.delete(this.temp).subscribe({
      next: (value) => console.log(value),
      error: (err) => {
        console.log(err)
        if(err.code === 200){
          this.deleted = false;

          this.presentToast("Object supprimé avec Succées");
          this.isModalOpen = false;
          this.isModalOpens = true;
          this.deleted = false;

        }else{
          this.deleted = false;

          this.presentToast("Nous rencontrons une erreur verifez votre connection et réessayer")

        }

         this.submitted = false},
      complete: () => {
        this.deleted = false;

        this.isModalOpen = false;
        this.isModalOpens = true;
        this.presentToast("Object supprimé avec Succées")
      },
    });
  }
  logout(){
    this.log.logout();
  }
  search(words: any){
    let word  = words.target.value
    if( word !== ""){
      let filter = this.backup.filter((item:any)=> item.title.toLowerCase().includes(word.toLowerCase())  || item.description.toLowerCase().includes(word.toLowerCase()) );
      this.data = filter;
    }else{
      this.data = this.backup;

    }
  }


  filtres(){
    if(this.range==="croissant"){
      console.log("croissant");
      this.data = this.backup.sort((a:any,b:any)=>
      {
      if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime() ) {
        console.log("inferieur")
        return -1;
      }
      if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ) {
        console.log("superieur")

        return 1;

      }
      return 0;
      })



      if(this.lieu === "inferieur"){
        let filter = this.data.filter((item:any)=> item.places.length <= 1);
        this.data = filter;

      }
      if(this.lieu === "auplus"){
        let filter = this.data.filter((item:any)=> item.places.length <= 3);
        this.data = filter;

      }
      if(this.lieu === "plus"){
        let filter = this.data.filter((item:any)=> item.places.length > 3);
        this.data = filter;
      }
    }
    if(this.range==="decroissant"){
      console.log("decroissant");

      this.data = this.backup.sort((a:any,b:any)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      if(this.lieu === "inferieur"){
        let filter = this.data.filter((item:any)=> item.places.length <= 1);
        this.data = filter;

      }
      if(this.lieu === "auplus"){
        let filter = this.data.filter((item:any)=> item.places.length <= 3);
        this.data = filter;

      }
      if(this.lieu === "plus"){
        let filter = this.data.filter((item:any)=> item.places.length > 3);
        this.data = filter;
      }
    }
    if(this.lieu === "inferieur"){
      let filter = this.backup.filter((item:any)=> item.places.length <= 1);
      this.data = filter;

    }
    if(this.lieu === "auplus"){
      let filter = this.backup.filter((item:any)=> item.places.length <= 3);
      this.data = filter;

    }
    if(this.lieu === "plus"){
      let filter = this.backup.filter((item:any)=> item.places.length > 3);
      this.data = filter;
    }
    this.isFilter = false;

  }

  handleChange(ev:any) {
    let state  = ev.target.value
    if( state !== "tout"){
      console.log(state +  typeof(state));

      let filter = this.backup.filter((item:any)=> item.isFound.toString().toLowerCase() === state.toLowerCase()  );
      this.data = filter;
    }else{
      this.data = this.backup;

    }  }


    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 1500,
        position: "top",
      });

      await toast.present();
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
         complete: () => (this.state = false, this.temporaile = {} , this.ngOnInit(),     this.objectDialog = false , this.presentToast("Compte supprimé avec Succés")    ),
       });
      }
     }

     openFilter(){
      this.isFilter = true;
     }
}
