package com.flight.flightsafety.model;

import jakarta.persistence.*;

@Entity
public class FlightData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private double wind;
    private double temp;
    private String risk;
    private String time;

    public Long getId() { return id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public double getWind() { return wind; }
    public void setWind(double wind) { this.wind = wind; }

    public double getTemp() { return temp; }
    public void setTemp(double temp) { this.temp = temp; }

    public String getRisk() { return risk; }
    public void setRisk(String risk) { this.risk = risk; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}