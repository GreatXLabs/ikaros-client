/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Win64 (AMD64)
--
-- Host: br1.aguilucho.ar    Database: Ikaros
-- ------------------------------------------------------
-- Server version	10.3.39-MariaDB-1:10.3.39+maria~ubu2004

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Acciones`
--

DROP TABLE IF EXISTS `Acciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Acciones` (
  `AccionID` int(11) NOT NULL AUTO_INCREMENT,
  `Accion` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`AccionID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Acciones`
--

LOCK TABLES `Acciones` WRITE;
/*!40000 ALTER TABLE `Acciones` DISABLE KEYS */;
INSERT INTO `Acciones` VALUES
(1,'Crear Mision'),
(2,'Modificar Mision'),
(3,'Cancelar Mision'),
(4,'Finalizar Mision'),
(5,'Asignar Trip. Mision'),
(6,'Registrar Evento'),
(7,'Desestimar Evento'),
(8,'Alta Tripulante'),
(9,'Modificar Tripulante'),
(10,'Baja Tripulante'),
(11,'Asignar Aptitud'),
(12,'Modificar Calificacion'),
(13,'Alta Usuario'),
(14,'Modificar Usuario'),
(15,'Inicio de Sesion'),
(16,'Cierre de Sesion');
/*!40000 ALTER TABLE `Acciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Aptitudes`
--

DROP TABLE IF EXISTS `Aptitudes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Aptitudes` (
  `AptitudID` int(11) NOT NULL AUTO_INCREMENT,
  `Aptitud` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`AptitudID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Aptitudes`
--

LOCK TABLES `Aptitudes` WRITE;
/*!40000 ALTER TABLE `Aptitudes` DISABLE KEYS */;
INSERT INTO `Aptitudes` VALUES
(1,'Pilotaje de Nave Espacial'),
(2,'Navegacion Orbital'),
(3,'Mant. Soporte Vital'),
(4,'Op. Modulo de Aterrizaje'),
(5,'Ingenieria de Propulsion'),
(6,'Comunicaciones y Telemetria'),
(7,'Geologia Planetaria'),
(8,'Astrofisica Aplicada'),
(9,'Medicina Espacial'),
(10,'Op. Vehiculo Exploracion'),
(11,'EVA / Caminata Espacial'),
(12,'Robotica y Manip. Remota'),
(13,'Gestion de Emergencias'),
(14,'Biologia Espacial'),
(15,'Op. Armamento Defensivo');
/*!40000 ALTER TABLE `Aptitudes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Capacidades`
--

DROP TABLE IF EXISTS `Capacidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Capacidades` (
  `TripulanteID` int(11) NOT NULL,
  `AptitudID` int(11) NOT NULL,
  `Calificacion` int(11) DEFAULT NULL,
  `FechaCapacidades` date DEFAULT NULL,
  PRIMARY KEY (`TripulanteID`,`AptitudID`),
  KEY `fk_Capacidades_AptitudID` (`AptitudID`),
  CONSTRAINT `fk_Capacidades_AptitudID` FOREIGN KEY (`AptitudID`) REFERENCES `Aptitudes` (`AptitudID`),
  CONSTRAINT `fk_Capacidades_TripulanteID` FOREIGN KEY (`TripulanteID`) REFERENCES `Tripulantes` (`TripulanteID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Capacidades`
--

LOCK TABLES `Capacidades` WRITE;
/*!40000 ALTER TABLE `Capacidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `Capacidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Entidades`
--

DROP TABLE IF EXISTS `Entidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Entidades` (
  `TipoEntidadID` int(11) NOT NULL AUTO_INCREMENT,
  `TipoEntidad` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`TipoEntidadID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Entidades`
--

LOCK TABLES `Entidades` WRITE;
/*!40000 ALTER TABLE `Entidades` DISABLE KEYS */;
INSERT INTO `Entidades` VALUES
(1,'Mision'),
(2,'Tripulante'),
(3,'Evento'),
(4,'Usuario'),
(5,'Capacidad');
/*!40000 ALTER TABLE `Entidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadosEventos`
--

DROP TABLE IF EXISTS `EstadosEventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadosEventos` (
  `EstadoEID` int(11) NOT NULL AUTO_INCREMENT,
  `Estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EstadoEID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadosEventos`
--

LOCK TABLES `EstadosEventos` WRITE;
/*!40000 ALTER TABLE `EstadosEventos` DISABLE KEYS */;
INSERT INTO `EstadosEventos` VALUES
(1,'Estimado'),
(2,'Desestimado');
/*!40000 ALTER TABLE `EstadosEventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadosMisiones`
--

DROP TABLE IF EXISTS `EstadosMisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadosMisiones` (
  `EstadoMID` int(11) NOT NULL AUTO_INCREMENT,
  `Estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EstadoMID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadosMisiones`
--

LOCK TABLES `EstadosMisiones` WRITE;
/*!40000 ALTER TABLE `EstadosMisiones` DISABLE KEYS */;
INSERT INTO `EstadosMisiones` VALUES
(1,'Planificada'),
(2,'Preparada'),
(3,'En Curso'),
(4,'Finalizada'),
(5,'Cancelada');
/*!40000 ALTER TABLE `EstadosMisiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EstadosTripulantes`
--

DROP TABLE IF EXISTS `EstadosTripulantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `EstadosTripulantes` (
  `EstadoTID` int(11) NOT NULL AUTO_INCREMENT,
  `Estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EstadoTID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EstadosTripulantes`
--

LOCK TABLES `EstadosTripulantes` WRITE;
/*!40000 ALTER TABLE `EstadosTripulantes` DISABLE KEYS */;
INSERT INTO `EstadosTripulantes` VALUES
(1,'Activo'),
(2,'Inactivo'),
(3,'Retirado');
/*!40000 ALTER TABLE `EstadosTripulantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Eventos`
--

DROP TABLE IF EXISTS `Eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Eventos` (
  `EventoID` int(11) NOT NULL AUTO_INCREMENT,
  `MisionID` int(11) DEFAULT NULL,
  `EstadoEID` int(11) DEFAULT 1,
  `Titulo` varchar(20) DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventoID`),
  KEY `fk_Eventos_MisionID` (`MisionID`),
  KEY `fk_Eventos_EstadoEID` (`EstadoEID`),
  CONSTRAINT `fk_Eventos_EstadoEID` FOREIGN KEY (`EstadoEID`) REFERENCES `EstadosEventos` (`EstadoEID`),
  CONSTRAINT `fk_Eventos_MisionID` FOREIGN KEY (`MisionID`) REFERENCES `Misiones` (`MisionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Eventos`
--

LOCK TABLES `Eventos` WRITE;
/*!40000 ALTER TABLE `Eventos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GruposMisiones`
--

DROP TABLE IF EXISTS `GruposMisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `GruposMisiones` (
  `TripulanteID` int(11) NOT NULL,
  `MisionID` int(11) NOT NULL,
  `FechaAsignacion` datetime DEFAULT NULL,
  PRIMARY KEY (`TripulanteID`,`MisionID`),
  KEY `fk_GruposMisiones_MisionID` (`MisionID`),
  CONSTRAINT `fk_GruposMisiones_MisionID` FOREIGN KEY (`MisionID`) REFERENCES `Misiones` (`MisionID`),
  CONSTRAINT `fk_GruposMisiones_TripulanteID` FOREIGN KEY (`TripulanteID`) REFERENCES `Tripulantes` (`TripulanteID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GruposMisiones`
--

LOCK TABLES `GruposMisiones` WRITE;
/*!40000 ALTER TABLE `GruposMisiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `GruposMisiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Misiones`
--

DROP TABLE IF EXISTS `Misiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Misiones` (
  `MisionID` int(11) NOT NULL AUTO_INCREMENT,
  `EstadoMID` int(11) DEFAULT NULL,
  `FechaInicioEstimada` datetime DEFAULT NULL,
  `FechaFinEstimada` datetime DEFAULT NULL,
  `RetrasoInicio` int(11) DEFAULT 0,
  `RetrasoFin` int(11) DEFAULT 0,
  `Nombre` varchar(20) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MisionID`),
  KEY `fk_Misiones_EstadoMID` (`EstadoMID`),
  CONSTRAINT `fk_Misiones_EstadoMID` FOREIGN KEY (`EstadoMID`) REFERENCES `EstadosMisiones` (`EstadoMID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Misiones`
--

LOCK TABLES `Misiones` WRITE;
/*!40000 ALTER TABLE `Misiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `Misiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Registros`
--

DROP TABLE IF EXISTS `Registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Registros` (
  `RegistroID` int(11) NOT NULL AUTO_INCREMENT,
  `AccionID` int(11) DEFAULT NULL,
  `UsuarioID` int(11) DEFAULT NULL,
  `TipoEntidadID` int(11) DEFAULT NULL,
  `EntidadID` int(11) DEFAULT NULL,
  `FechaHora` datetime DEFAULT NULL,
  PRIMARY KEY (`RegistroID`),
  KEY `fk_Registros_AccionID` (`AccionID`),
  KEY `fk_Registros_UsuarioID` (`UsuarioID`),
  KEY `fk_Registros_TipoEntidadID` (`TipoEntidadID`),
  CONSTRAINT `fk_Registros_AccionID` FOREIGN KEY (`AccionID`) REFERENCES `Acciones` (`AccionID`),
  CONSTRAINT `fk_Registros_TipoEntidadID` FOREIGN KEY (`TipoEntidadID`) REFERENCES `Entidades` (`TipoEntidadID`),
  CONSTRAINT `fk_Registros_UsuarioID` FOREIGN KEY (`UsuarioID`) REFERENCES `Usuarios` (`UsuarioID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Registros`
--

LOCK TABLES `Registros` WRITE;
/*!40000 ALTER TABLE `Registros` DISABLE KEYS */;
/*!40000 ALTER TABLE `Registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `RolID` int(11) NOT NULL AUTO_INCREMENT,
  `Rol` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`RolID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES
(1,'Jefe'),
(2,'RRHH'),
(3,'Asignador'),
(4,'Coordinador'),
(5,'Registrador');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sexos`
--

DROP TABLE IF EXISTS `Sexos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sexos` (
  `SexoID` int(11) NOT NULL AUTO_INCREMENT,
  `Sexo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`SexoID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sexos`
--

LOCK TABLES `Sexos` WRITE;
/*!40000 ALTER TABLE `Sexos` DISABLE KEYS */;
INSERT INTO `Sexos` VALUES
(1,'Masculino'),
(2,'Femenino');
/*!40000 ALTER TABLE `Sexos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tripulantes`
--

DROP TABLE IF EXISTS `Tripulantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tripulantes` (
  `TripulanteID` int(11) NOT NULL AUTO_INCREMENT,
  `EstadoTID` int(11) DEFAULT NULL,
  `SexoID` int(11) DEFAULT NULL,
  `Peso` int(11) DEFAULT NULL,
  `Altura` int(11) DEFAULT NULL,
  `Nombre` varchar(40) DEFAULT NULL,
  `Apellido` varchar(40) DEFAULT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `FechaDeNacimiento` date DEFAULT NULL,
  PRIMARY KEY (`TripulanteID`),
  KEY `fk_Tripulantes_EstadoTID` (`EstadoTID`),
  KEY `fk_Tripulantes_SexoID` (`SexoID`),
  CONSTRAINT `fk_Tripulantes_EstadoTID` FOREIGN KEY (`EstadoTID`) REFERENCES `EstadosTripulantes` (`EstadoTID`),
  CONSTRAINT `fk_Tripulantes_SexoID` FOREIGN KEY (`SexoID`) REFERENCES `Sexos` (`SexoID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tripulantes`
--

LOCK TABLES `Tripulantes` WRITE;
/*!40000 ALTER TABLE `Tripulantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Tripulantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuarios`
--

DROP TABLE IF EXISTS `Usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuarios` (
  `UsuarioID` int(11) NOT NULL AUTO_INCREMENT,
  `RolID` int(11) DEFAULT NULL,
  `Usuario` varchar(20) DEFAULT NULL,
  `Nombre` varchar(40) DEFAULT NULL,
  `Apellido` varchar(40) DEFAULT NULL,
  `Clave` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`UsuarioID`),
  KEY `fk_Usuarios_RolID` (`RolID`),
  CONSTRAINT `fk_Usuarios_RolID` FOREIGN KEY (`RolID`) REFERENCES `Roles` (`RolID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuarios`
--

LOCK TABLES `Usuarios` WRITE;
/*!40000 ALTER TABLE `Usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `Usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'Ikaros'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `ValidarLogin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` FUNCTION `ValidarLogin`(
    p_Usuario VARCHAR(20),
    p_Clave   VARCHAR(20)
) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
    DECLARE v_Count INT;

    SELECT COUNT(*) INTO v_Count
    FROM Usuarios
    WHERE Usuario = p_Usuario AND Clave = p_Clave;

    RETURN v_Count > 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ACapacidad` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ACapacidad`(
    IN p_TripulanteID    INT,
    IN p_AptitudID       INT,
    IN p_Calificacion    INT,
    IN p_FechaCapacidades DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaCapacidad Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Capacidades (TripulanteID, AptitudID, Calificacion, FechaCapacidades)
    VALUES (p_TripulanteID, p_AptitudID, p_Calificacion, p_FechaCapacidades);
    COMMIT;
    SELECT 'Exito:AltaCapacidad Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `AEvento`(
    IN p_MisionID    INT,
    IN p_Titulo      VARCHAR(20),
    IN p_Descripcion VARCHAR(255),
    IN p_Fecha       DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaEvento Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Eventos (MisionID, Titulo, Descripcion, Fecha)
    VALUES (p_MisionID, p_Titulo, p_Descripcion, p_Fecha);
    COMMIT;
    SELECT 'Exito:AltaEvento Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AGrupoMision` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `AGrupoMision`(
    IN p_TripulanteID    INT,
    IN p_MisionID        INT,
    IN p_FechaAsignacion DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaGrupoMision Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO GruposMisiones (TripulanteID, MisionID, FechaAsignacion)
    VALUES (p_TripulanteID, p_MisionID, p_FechaAsignacion);
    COMMIT;
    SELECT 'Exito:AltaGrupoMision Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AMision` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `AMision`(
    IN p_EstadoMID           INT,
    IN p_Nombre              VARCHAR(20),
    IN p_Descripcion         VARCHAR(255),
    IN p_FechaInicioEstimada DATETIME,
    IN p_FechaFinEstimada    DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaMision Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Misiones (EstadoMID, Nombre, Descripcion, FechaInicioEstimada, FechaFinEstimada)
    VALUES (p_EstadoMID, p_Nombre, p_Descripcion, p_FechaInicioEstimada, p_FechaFinEstimada);
    COMMIT;
    SELECT 'Exito:AltaMision Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ARegistro` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ARegistro`(
    IN p_UsuarioID     INT,
    IN p_AccionID      INT,
    IN p_TipoEntidadID INT,
    IN p_EntidadID     INT,
    IN p_FechaHora     DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaRegistro Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Registros (UsuarioID, AccionID, TipoEntidadID, EntidadID, FechaHora)
    VALUES (p_UsuarioID, p_AccionID, p_TipoEntidadID, p_EntidadID, p_FechaHora);
    COMMIT;
    SELECT 'Exito:AltaRegistro Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ATripulante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ATripulante`(
    IN p_EstadoTID         INT,
    IN p_SexoID            INT,
    IN p_Peso              INT,
    IN p_Altura            INT,
    IN p_Nombre            VARCHAR(40),
    IN p_Apellido          VARCHAR(40),
    IN p_Imagen            VARCHAR(255),
    IN p_FechaDeNacimiento DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaTripulante Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Tripulantes (EstadoTID, SexoID, Peso, Altura, Nombre, Apellido, Imagen, FechaDeNacimiento)
    VALUES (p_EstadoTID, p_SexoID, p_Peso, p_Altura, p_Nombre, p_Apellido, p_Imagen, p_FechaDeNacimiento);
    COMMIT;
    SELECT 'Exito:AltaTripulante Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `AUsuario`(
    IN p_RolID    INT,
    IN p_Usuario  VARCHAR(20),
    IN p_Nombre   VARCHAR(40),
    IN p_Apellido VARCHAR(40),
    IN p_Clave    VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:AltaUsuario Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    INSERT INTO Usuarios (RolID, Usuario, Nombre, Apellido, Clave)
    VALUES (p_RolID, p_Usuario, p_Nombre, p_Apellido, p_Clave);
    COMMIT;
    SELECT 'Exito:AltaUsuario Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `BEvento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `BEvento`(
    IN p_EventoID  INT,
    IN p_EstadoEID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:BajaLogicaEvento Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    UPDATE Eventos
    SET EstadoEID = p_EstadoEID
    WHERE EventoID = p_EventoID;
    COMMIT;
    SELECT 'Exito:BajaLogicaEvento Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ConsultarEventos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ConsultarEventos`(IN p_MisionID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR:ConsultarEventos Falló la consulta.' AS MensajeResultado;
    END;

    SELECT
        E.EventoID,
        E.Titulo,
        E.Fecha,
        E.Descripcion,
        EE.Estado AS EstadoEvento
    FROM Eventos E
    INNER JOIN EstadosEventos EE ON E.EstadoEID = EE.EstadoEID
    WHERE E.MisionID = p_MisionID
    ORDER BY E.Fecha ASC;

    SELECT 'Exito:ConsultarEventos Consulta realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ConsultarMision` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ConsultarMision`(IN p_MisionID INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR:ConsultarMision Falló la consulta.' AS MensajeResultado;
    END;

    SELECT
        M.MisionID,
        M.Nombre,
        M.Descripcion,
        E.Estado AS EstadoMision,
        M.FechaInicioEstimada,
        M.FechaFinEstimada,
        M.RetrasoInicio,
        M.RetrasoFin
    FROM Misiones M
    INNER JOIN EstadosMisiones E ON M.EstadoMID = E.EstadoMID
    WHERE M.MisionID = p_MisionID;

    SELECT 'Exito:ConsultarMision Consulta realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ListarTripulantes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `ListarTripulantes`()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR:ListarTripulantes Falló la consulta.' AS MensajeResultado;
    END;

    SELECT
        T.TripulanteID AS ID,
        T.Nombre,
        T.Apellido,
        T.Imagen,
        E.Estado
    FROM Tripulantes T
    INNER JOIN EstadosTripulantes E ON T.EstadoTID = E.EstadoTID;

    SELECT 'Exito:ListarTripulantes Consulta realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MCapacidad` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `MCapacidad`(
    IN p_TripulanteID     INT,
    IN p_AptitudID        INT,
    IN p_Calificacion     INT,
    IN p_FechaCapacidades DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:ModificarCapacidad Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    UPDATE Capacidades
    SET
        Calificacion     = p_Calificacion,
        FechaCapacidades = p_FechaCapacidades
    WHERE TripulanteID = p_TripulanteID AND AptitudID = p_AptitudID;
    COMMIT;
    SELECT 'Exito:ModificarCapacidad Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MMision` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `MMision`(
    IN p_MisionID            INT,
    IN p_EstadoMID           INT,
    IN p_Nombre              VARCHAR(20),
    IN p_Descripcion         VARCHAR(255),
    IN p_FechaInicioEstimada DATETIME,
    IN p_FechaFinEstimada    DATETIME
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:ModificarMision Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    UPDATE Misiones
    SET
        Nombre              = p_Nombre,
        EstadoMID           = p_EstadoMID,
        Descripcion         = p_Descripcion,
        FechaInicioEstimada = p_FechaInicioEstimada,
        FechaFinEstimada    = p_FechaFinEstimada
    WHERE MisionID = p_MisionID;
    COMMIT;
    SELECT 'Exito:ModificarMision Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MTripulante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `MTripulante`(
    IN p_TripulanteID      INT,
    IN p_EstadoTID         INT,
    IN p_SexoID            INT,
    IN p_Peso              INT,
    IN p_Altura            INT,
    IN p_Nombre            VARCHAR(40),
    IN p_Apellido          VARCHAR(40),
    IN p_Imagen            VARCHAR(255),
    IN p_FechaDeNacimiento DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:ModificarTripulante Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    UPDATE Tripulantes
    SET
        EstadoTID         = p_EstadoTID,
        SexoID            = p_SexoID,
        Peso              = p_Peso,
        Altura            = p_Altura,
        Nombre            = p_Nombre,
        Apellido          = p_Apellido,
        Imagen            = p_Imagen,
        FechaDeNacimiento = p_FechaDeNacimiento
    WHERE TripulanteID = p_TripulanteID;
    COMMIT;
    SELECT 'Exito:ModificarTripulante Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MUsuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `MUsuario`(
    IN p_UsuarioID INT,
    IN p_RolID     INT,
    IN p_Usuario   VARCHAR(20),
    IN p_Nombre    VARCHAR(40),
    IN p_Apellido  VARCHAR(40),
    IN p_Clave     VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'ERROR:ModificarUsuario Transaccion fallida.' AS MensajeResultado;
    END;
    START TRANSACTION;
    UPDATE Usuarios
    SET
        RolID    = p_RolID,
        Usuario  = p_Usuario,
        Nombre   = p_Nombre,
        Apellido = p_Apellido,
        Clave    = p_Clave
    WHERE UsuarioID = p_UsuarioID;
    COMMIT;
    SELECT 'Exito:ModificarUsuario Transaccion realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `VerLogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`ikaros_admin`@`%` PROCEDURE `VerLogs`()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SELECT 'ERROR:VerLogs Falló la consulta.' AS MensajeResultado;
    END;

    SELECT
        R.RegistroID AS ID,
        U.Usuario,
        A.Accion,
        E.TipoEntidad,
        R.EntidadID,
        R.FechaHora
    FROM Registros R
    INNER JOIN Usuarios U  ON R.UsuarioID     = U.UsuarioID
    INNER JOIN Acciones A  ON R.AccionID       = A.AccionID
    INNER JOIN Entidades E ON R.TipoEntidadID  = E.TipoEntidadID
    ORDER BY R.FechaHora DESC;

    SELECT 'Exito:VerLogs Consulta realizada sin inconvenientes.' AS MensajeResultado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-04-25 20:34:23
