import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthentificationService } from './authentification.service';



@Injectable({
  providedIn: 'root'
})
export class PushService {

constructor(private service: AuthentificationService){}

 deviceToken = this.service.token; // Remplacez cela par le vrai token

 serverKey = 'AAAA9Vkl26Q:APA91bEqOPbTrOW6Srn4coGeqIa248aOGxbfUbmvtTt01ruxtU209OmVocpnQ-BRL9O7AIGbpKLWcJsB0hiBquqnRR-gPL-YKcMPFg3VoOhTfhwkM-B2jo2JhCs7dyDt05OD9oTsRNmr';

 notificationData = {
  to: this.deviceToken,
  notification: {
    title: 'Nouvel objet enregistré',
    body: 'L\'objet a été enregistré avec succès.',
  },
};

createPushNotification(){
  axios.post('https://fcm.googleapis.com/fcm/send', this.notificationData, {
  headers: {
    Authorization: `key=${this.serverKey}`,
    'Content-Type': 'application/json',
  },
})
.then(response => {
  console.log('Notification envoyée avec succès :', response.data);
})
.catch(error => {
  console.error('Erreur lors de l\'envoi de la notification :', error);
});
}
}
