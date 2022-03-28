package com.goodfoodgoodmood.GoodFoodGoodMood.beans;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


@Entity
public class Avis {

    //On indique que l'Id est la clé primaire
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int ID;
    private String pseudo;
    private String date;
    private String description;

    @Override
    public String toString() {
        return "Avis{" +
                "ID=" + ID +
                ", pseudo='" + pseudo + '\'' +
                ", date='" + date + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public Avis() {
    }

    public Avis(String pseudo, String date, String description) {
        this.pseudo = pseudo;
        this.date = date;
        this.description = description;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }
}
