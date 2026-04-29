package com.flight.flightsafety.controller;

import com.flight.flightsafety.model.FlightData;
import com.flight.flightsafety.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin
public class FlightController {

    @Autowired
    private FlightRepository repo;

    @GetMapping("/api/risk")
    public String getRisk(
            @RequestParam double wind,
            @RequestParam double temp,
            @RequestParam String source,
            @RequestParam String destination
    ) {
        String result;

        if (wind > 80 || temp < -10 || temp > 40) {
            result = "🔴 HIGH RISK";
        } else if (wind > 50 || temp < 0 || temp > 35) {
            result = "🟡 MEDIUM RISK";
        } else {
            result = "🟢 LOW RISK";
        }

        FlightData flight = new FlightData();
        flight.setSource(source);
        flight.setDestination(destination);
        flight.setWind(wind);
        flight.setTemp(temp);
        flight.setRisk(result);
        flight.setTime(LocalDateTime.now().toString());

        repo.save(flight);

        return result;
    }

    @GetMapping("/api/flights")
    public List<FlightData> getFlights() {
        return repo.findAll();
    }
}