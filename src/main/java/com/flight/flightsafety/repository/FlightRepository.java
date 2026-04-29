package com.flight.flightsafety.repository;

import com.flight.flightsafety.model.FlightData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightRepository extends JpaRepository<FlightData, Long> {
}