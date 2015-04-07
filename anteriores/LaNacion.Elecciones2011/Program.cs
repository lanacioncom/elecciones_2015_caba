using System;
using System.Linq;
using System.Configuration;
using LaNacion.Framework.Helpers;
using System.Xml.XPath;
using System.Xml.Linq;
using System.IO;
using System.Xml.Xsl;
using System.Text;

namespace LaNacion.Elecciones
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.ResetColor();
            try
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Actualizacion de Elecciones Primarias");
                Console.WriteLine("");
                
                convertirDeCVSaXML();

                XPathNavigator xml = obtenerXml();

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Generando archivos de XML para LN7");
                Console.ResetColor();

                generarArchivo(xml, "seguimiento para Home", ConfigurationManager.AppSettings["EnHomeXML"], ConfigurationManager.AppSettings["EnHomeXSLT"], ConfigurationManager.AppSettings["EnHomeSalidaDeDatos"], ConfigurationManager.AppSettings["ReplicaDestinoEnHomeXML"], ConfigurationManager.AppSettings["ReplicaDestinoPathBaseEnHomeXML"], ConfigurationManager.AppSettings["Usuario"], ConfigurationManager.AppSettings["Dominio"], ConfigurationManager.AppSettings["Password"], Guid.NewGuid().ToString());

                generarArchivo(xml, "seguimineto para Mapa", ConfigurationManager.AppSettings["PaisXML"], ConfigurationManager.AppSettings["PaisXSLT"], ConfigurationManager.AppSettings["PaisSalidaDeDatos"], ConfigurationManager.AppSettings["ReplicaDestinoPaisXML"], ConfigurationManager.AppSettings["ReplicaDestinoPathBasePaisXML"], ConfigurationManager.AppSettings["Usuario"], ConfigurationManager.AppSettings["Dominio"], ConfigurationManager.AppSettings["Password"], Guid.NewGuid().ToString());

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine("Fin de los procesos");
                Console.WriteLine("");
                //Console.WriteLine("Precione ENTER para salir de la aplicacion");
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Error");
                Console.Write("\t\t");
                Console.WriteLine(ex.Message);
                Console.ResetColor();
            }

            Console.ResetColor();
            //Console.ReadKey();

            
        }

        private static void generarArchivo(XPathNavigator xml, string title, string xmlFile, string xsltFile, string pathBaseGeneracion, string xmlDestinoReplica, string pathBaseXmlDestinoReplica, string usuario, string dominio, string password, string contexto)
        {
            
            XsltArgumentList xsltArgumentList = new XsltArgumentList();
            
            Console.Write("\t - Generando archivo {0}...", title);

            xmlFile = string.Concat(
                pathBaseGeneracion.TrimEnd(Path.DirectorySeparatorChar),
                Path.DirectorySeparatorChar,
                xmlFile.TrimStart(Path.DirectorySeparatorChar)
                ).Replace("[contexto]", contexto);

            FileHelper.CreateRecursiveFolder(pathBaseGeneracion);

            XmlHelper.SaveXML(
                xmlFile,
            XmlHelper.ParseXml(XmlHelper.Transform(xml, XmlHelper.LoadXslt(xsltFile), xsltArgumentList), true),
            Encoding.UTF8);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();

            int replica;
            int.TryParse(ConfigurationManager.AppSettings["Replica"], out replica);

            if (replica == 1)
            {
                Console.Write("\t\t - Replicando archivos a servidores...");

                StringBuilder sb = new StringBuilder();
                sb.AppendLine(xmlDestinoReplica);

                pathBaseXmlDestinoReplica = string.Concat(
                    pathBaseXmlDestinoReplica.TrimEnd(Path.DirectorySeparatorChar),
                    Path.DirectorySeparatorChar
                    ).Replace("[contexto]", contexto);

                xmlDestinoReplica = string.Concat(
                    pathBaseXmlDestinoReplica,
                    xmlDestinoReplica.TrimStart(Path.DirectorySeparatorChar)
                    ).Replace("[contexto]", contexto);

                
                string pathListado = string.Concat(pathBaseXmlDestinoReplica, Path.DirectorySeparatorChar, "listado.txt");

                FileHelper.CreateRecursiveFolder(pathBaseXmlDestinoReplica);

                FileHelper.ManageFiles(xmlFile, xmlDestinoReplica, "xml", usuario, dominio, password, false, true);

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("OK");
                Console.ResetColor();

                Console.Write("\t\t - Escribiendo lista de archivos...");
                Encoding e = Encoding.UTF8;
                File.AppendAllText(string.Concat(pathListado,"-tmp"), sb.ToString(), e);
                File.Move(string.Concat(pathListado, "-tmp"), pathListado);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("OK");
                Console.ResetColor();
            }


            /*
            Console.Write("\t - Renombrando Archivos con la hora, minutos y segundos del día actual...");

            DateTime dt = DateTime.Now;

            File.Move(PrimariasEnHomeXML, SalidaDeDatos + "HomeXML" + String.Format("{0:HH.mm.ss}", dt) + ".xml");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            */

            Console.ResetColor();
        }

        private static XPathNavigator obtenerXml()
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("Generando archivo de XML Maestro");
            Console.ResetColor();
            Console.Write("\t - Agregando TotalesXML...");
            XPathNavigator xml = XmlHelper.ParseXml("<?xml version=\"1.0\" encoding=\"utf-8\"?><xml />", false);

            XmlHelper.ConcatNode(xml, XmlHelper.LoadXml(ConfigurationManager.AppSettings["TotalesXML"], true), XPathExpression.Compile("/xml"), XPathExpression.Compile("/totales"), true);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();
            Console.Write("\t - Agregando TotalesPorListaXML...");
            XmlHelper.ConcatNode(xml, XmlHelper.LoadXml(ConfigurationManager.AppSettings["TotalesPorListaXML"], true), XPathExpression.Compile("/xml"), XPathExpression.Compile("/porLista"), true);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();
            Console.Write("\t - Agregando RelacionesXML...");
            XmlHelper.ConcatNode(xml, XmlHelper.LoadXml(ConfigurationManager.AppSettings["RelacionesXML"], true), XPathExpression.Compile("/xml"), XPathExpression.Compile("/formulas"), true);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();

            return xml;
        }

        private static void convertirDeCVSaXML()
        {
            
            int tmp;
            int.TryParse(ConfigurationManager.AppSettings["DatosEnBlanco"], out tmp);

            bool datosEnBlanco = (tmp == 1) ? true : false;



            if (datosEnBlanco) 
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("USANDO DATOS EN BLANCO");
                Console.ResetColor();
                
            }

            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("Procesando archivos del proveedor");
            Console.ResetColor();
            Console.Write("\t - Conviertiendo archivo 1 de CVS a XML...");

            if (File.Exists(ConfigurationManager.AppSettings["TotalesPorListas"]))
            {



                string[] source = File.ReadAllLines(ConfigurationManager.AppSettings["TotalesPorListas"]);


                XElement cust = new XElement("porLista",
                    from str in source
                    let fields = str.Split(';')
                    select new XElement("lugar",
                           new XAttribute("tipo", fields[0]),
                           new XAttribute("prov", fields[1]),
                           new XElement("nombre", fields[3].Trim(),
                            new XAttribute("muni", fields[2])
                           ),
                           new XAttribute("dia", fields[4]),
                           new XAttribute("hs", fields[5]),
                           new XAttribute("min", fields[6]),

                           new XElement("total",
                               new XAttribute("id", fields[7]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[8]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[9])
                            ),

                            fields[11] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[11]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[12]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[13])
                            ),

                            fields[14] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[14]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[15]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[16])
                            ),

                            fields[17] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[17]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[18]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[19])
                            ),

                            fields[20] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[20]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[21]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[22])
                            ),

                            fields[23] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[23]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[24]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[25])
                            ),

                            fields[26] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[26]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[27]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[28])
                            ),

                            fields[29] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[29]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[30]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[31])
                            ),

                            fields[32] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[32]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[33]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[34])
                            ),

                            fields[35] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[35]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[36]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[37])
                            ),

                            fields[38] == "0000" ? null :
                           new XElement("formula",
                               new XAttribute("id", fields[38]),
                            new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[39]),
                            new XAttribute("p", (datosEnBlanco) ? "00000" :fields[40])
                            ),

                           new XElement("cargos",
                               new XAttribute("e", fields[10]))
                        )
                    );

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("OK");
                Console.ResetColor();
                Console.Write("\t - Guardando archivo 1 como XML...");
                cust.Save(ConfigurationManager.AppSettings["TotalesPorListaXML"]);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("OK");
                Console.ResetColor();

            }
            else 
            { 
            
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("No existe el Archivo 1 - No cambia: " + Path.GetFileName(ConfigurationManager.AppSettings["TotalesPorListaXML"]) );
                Console.ResetColor();
            }

            Console.Write("\t - Conviertiendo archivo 2 de CVS a XML...");



            if (File.Exists(ConfigurationManager.AppSettings["Totales"]))
            {

            string[] source = File.ReadAllLines(ConfigurationManager.AppSettings["Totales"]);

            XElement cust = new XElement("totales",
                from str in source
                let fields = str.Split(';')
                select new XElement("lugar",
                       new XAttribute("tipo", fields[0]),
                       new XAttribute("prov", fields[1]),
                       new XElement("nombre", fields[3].Trim(),
                        new XAttribute("muni", fields[2])
                       ),
                       new XElement("mesas",
                           new XAttribute("c", (datosEnBlanco) ? "00000" : fields[4]),
                           new XAttribute("e", (datosEnBlanco) ? "00000" : fields[5]),
                           new XAttribute("p", (datosEnBlanco) ? "00000" : fields[6])
                       ),
                       new XElement("electores",
                           new XAttribute("c", (datosEnBlanco) ? "00000" : fields[7]),
                           new XAttribute("v", (datosEnBlanco) ? "00000000" :fields[8]),
                           new XAttribute("pC",(datosEnBlanco) ? "00000" : fields[9]),

                           new XAttribute("pE", (datosEnBlanco) ? "00000" : fields[10]),
                           new XAttribute("eE", (datosEnBlanco) ? "00000000" : fields[11]),
                           new XAttribute("pVE",(datosEnBlanco) ? "00000" : fields[12])
                        ),

                       new XElement("votos",
                           new XAttribute("vV", (datosEnBlanco) ? "00000000" : fields[13]),
                           new XAttribute("pVV", (datosEnBlanco) ? "00000" : fields[14]),

                           new XAttribute("vP", (datosEnBlanco) ? "00000000" : fields[15]),
                           new XAttribute("pVP", (datosEnBlanco) ? "00000" : fields[16]),
                           new XAttribute("vB", (datosEnBlanco) ? "00000000" : fields[17]),
                           new XAttribute("pVB", (datosEnBlanco) ? "00000" : fields[18]),
                           new XAttribute("vN", (datosEnBlanco) ? "00000000" : fields[19]),

                           new XAttribute("pVN", (datosEnBlanco) ? "00000" : fields[20]),
                           new XAttribute("vRI", (datosEnBlanco) ? "00000000" : fields[21]),
                           new XAttribute("pVRI", (datosEnBlanco) ? "00000" : fields[22])
                           ),

                       new XElement("cargos",
                           new XAttribute("e", fields[23])),

                       new XAttribute("dia", fields[24]),
                       new XAttribute("hs", fields[25]),
                       new XAttribute("min", fields[26])

                       )
                );
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();
            Console.Write("\t - Guardando archivo 2 como XML...");
            cust.Save(ConfigurationManager.AppSettings["TotalesXML"]);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("OK");
            Console.ResetColor();


            }
            else
            {

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("No existe el Archivo 2 - No cambia: " + Path.GetFileName(ConfigurationManager.AppSettings["TotalesXML"]));
                Console.ResetColor();
            }
            
            
         }
    }
}
