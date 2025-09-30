import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ContatoService } from 'src/app/service/contato.service';
import { Contato } from 'src/app/model/contato';



@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.page.html',
  styleUrls: ['./cadastrar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CadastrarPage implements OnInit {
  nome!: string;
  telefone!: string;
  dataNascimento!: string;
  genero!: string;
  maxDate: string;


  constructor(private alertController: AlertController,
    private router: Router,
    private contatoService: ContatoService) {
      let hoje = new Date();
      this.maxDate = hoje.toISOString().split('T')[0];
    }

  ngOnInit() {
  }

  cadastrar(){
    if(!this.validar(this.nome) || !this.validar(this.telefone)){
      this.presentAlert("Erro ao Cadastrar", "Campos Obrigatórios")
      return;
    }
     let contato : Contato = new Contato(this.nome, this.telefone);
     this.dataNascimento = this.dataNascimento.split('T')[0];
     contato.dataNascimento = this.dataNascimento;
     contato.genero = this.genero
     this.contatoService.create(contato)
     this.presentAlert("Sucesso", "Contato Cadastrado")
     this.router.navigate(["/home"])
  }

  private validar(campo: any) : boolean{
    if(!campo){
      return false;
    }
    return true;
  }

   async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: 'Agenda de Contatos',
      subHeader: subHeader,
      message: message,
      buttons: ['ok'],
    });
    await alert.present();
  }

}
