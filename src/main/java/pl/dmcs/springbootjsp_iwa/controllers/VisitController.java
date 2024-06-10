package pl.dmcs.springbootjsp_iwa.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Student;
import pl.dmcs.springbootjsp_iwa.model.Visit;
import pl.dmcs.springbootjsp_iwa.repository.AddressRepository;
import pl.dmcs.springbootjsp_iwa.repository.StudentRepository;
import pl.dmcs.springbootjsp_iwa.security.services.VisitService;

import java.util.List;
import java.util.Map;



@RestController
@CrossOrigin(origins = "http://localhost:4200") // This can be removed if global configuration is working

public class VisitController {

    @RequestMapping("/visit")
    public String visit(Model model) {
        model.addAttribute("message","Simple String from VisitController.");
        Visit newVisit = new Visit();
        model.addAttribute("student",newVisit);
        return "visit";
    }

    @RequestMapping(value = "/addVisit.html", method = RequestMethod.POST)
    public String addVisit(@ModelAttribute("visit") Visit visit) {

        System.out.println(visit.getPatientName() + " " + visit.getPatientSurname() +
                " " + visit.getEmail() + " " + visit.getDate());

        return "redirect:visit";
    }

}

