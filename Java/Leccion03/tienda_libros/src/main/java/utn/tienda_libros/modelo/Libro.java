package utn.tienda_libros.modelo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Libro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLibro;   // 🔹 CAMBIADO: antes decía id_libro

    private String nombreLibro;
    private String autor;
    private Double precio;
    private Integer existencias;
}
