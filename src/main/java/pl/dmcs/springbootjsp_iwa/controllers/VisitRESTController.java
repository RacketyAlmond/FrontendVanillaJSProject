package pl.dmcs.springbootjsp_iwa.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Visit;
import pl.dmcs.springbootjsp_iwa.repository.VisitRepository;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/visit")
public class VisitRESTController {

    private final VisitRepository visitRepository;

    @Autowired
    public VisitRESTController(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    @GetMapping
    public List<Visit> findAllVisits() {
        return visitRepository.findAll();
    }

    @GetMapping("/username")
    public ResponseEntity<String> getUsername() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return new ResponseEntity<>(username, HttpStatus.OK);
    }

    @GetMapping("/username/{firstname}")
    public ResponseEntity<List<Visit>> getVisitsByFirstname(@PathVariable("firstname") String firstname) {
        List<Visit> visits = visitRepository.findByPatientName(firstname);
        return new ResponseEntity<>(visits, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Visit> addVisit(@RequestBody Visit visit) {
        visitRepository.save(visit);
        return new ResponseEntity<>(visit, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Visit> deleteVisit(@PathVariable("id") long id) {
        Visit visit = visitRepository.findById(id);
        if (visit == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        visitRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(@RequestBody Visit visit, @PathVariable("id") long id) {
        visit.setId(id);
        visitRepository.save(visit);
        return new ResponseEntity<>(visit, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Visit> updatePartOfVisit(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Visit visit = visitRepository.findById(id);
        if (visit == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        partialUpdate(visit, updates);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void partialUpdate(Visit visit, Map<String, Object> updates) {
        if (updates.containsKey("patientName")) {
            visit.setPatientName((String) updates.get("patientName"));
        }
        if (updates.containsKey("patientSurname")) {
            visit.setPatientSurname((String) updates.get("patientSurname"));
        }
        if (updates.containsKey("email")) {
            visit.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("date")) {
            visit.setDate((String) updates.get("date"));
        }
        visitRepository.save(visit);
    }

    @DeleteMapping
    public ResponseEntity<Visit> deleteVisits() {
        visitRepository.deleteAll();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
