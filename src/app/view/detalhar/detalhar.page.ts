import { Component, OnInit } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Contato } from 'src/app/model/contato';
import { IonicModule, AlertController } from '@ionic/angular';
import { ContatoService } from 'src/app/service/contato.service';

@Component({
  selector: 'app-detalhar',
  templateUrl: './detalhar.page.html',
  styleUrls: ['./detalhar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetalharPage implements OnInit {
  contato!: Contato
  editar: boolean = true;
  formCadastrar!: FormGroup;
  isSubmitted = false;

  constructor(private router: Router,
    private alertController: AlertController,
    private contatoService: ContatoService,
     private formBuilder: FormBuilder) {}


  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    if(nav?.extras?.state?.['objeto']){
      this.contato = nav?.extras?.state?.['objeto']
        this.formCadastrar = this.formBuilder.group({
        nome: [this.contato.nome, [Validators.required, Validators.minLength(8)]],
        telefone: [this.contato.telefone, [Validators.required, Validators.minLength(10)]],
        genero: [this.contato.genero, [Validators.required]],
        email: [this.contato.email, [Validators.required, Validators.email]],
      });
    }
  }

   get errorControl(){
    return this.formCadastrar.controls;
  }

  submitForm() : boolean{
    this.isSubmitted = true;
    if(!this.formCadastrar.valid){
      this.presentAlert("Erro ao Cadastrar", "Campos Obrigatórios")
      return false;
    }else{
      this.salvar();
      return true;
    }
  }

  salvar(){

    if(this.contatoService.update(this.contato, this.formCadastrar.value['nome'],
      this.formCadastrar.value['telefone'], this.formCadastrar.value['genero'],
      this.formCadastrar.value['email'])){
        this.presentAlert('Atualizar', 'Contato atualizado com sucesso')
        this.router.navigate(['/home'])
      }else{
        this.presentAlert('Atualizar', 'Erro ao atualizar contato')
      }
  }

  excluir(){
    this.presentConfirmAlert("Excluir Contato",
      "Você realmente deseja excluir contato?",
      this.excluirContato()
    )
  }
  excluirContato(){
    if(this.contatoService.delete(this.contato)){
      this.presentAlert("Excluir", "Exclusão efetuada com sucesso!");
      this.router.navigate(['/home'])
    }else{
      this.presentAlert("Erro ao Excluir", "Contato não Encontrado");
    }
  }

  alterarEdicao(){
    if(this.editar == false){
      this.editar = true;
    }else{
      this.editar = false;
    }
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

    async presentConfirmAlert(subHeader: string, message: string, acao: any) {
    const alert = await this.alertController.create({
      header: 'Agenda de Contatos',
      subHeader: subHeader,
      message: message,
      buttons: [
        {text: 'Cancelar', role: 'cancelar', cssClass: 'secondary', handler:()=>{}},
        {text: 'Confirmar', handler:(acao)=>{acao}}
      ],
    });
    await alert.present();
  }




}
