import { NgIterable } from "@angular/core";
import { RoleModel } from "./Role.Model";

export class UtilisateurModel{
    public id: number | undefined;
    public nomUser: string | undefined;
    public prenomUser: string | undefined;
    public passwordUser: string | undefined;
    public dateNaissanceUser: string | undefined;
    public telephoneUser: string | undefined;
    public emailUser: string | undefined;
    public sexeUser: string | undefined;
    public adresseUser: string | undefined;
    public archived?: number;
    public passwordChange: string | undefined;
    public numeroPieceIdentiteUser: string | undefined;
    public roles: RoleModel |  undefined;
    

   
}