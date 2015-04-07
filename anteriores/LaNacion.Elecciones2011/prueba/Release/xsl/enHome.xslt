<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/xml">
      <xsl:element name="elecciones">
        <xsl:for-each select="totales/lugar[(@tipo = 4 and nombre/@muni = 999 and @prov = 02) or  (@tipo = 1 and nombre/@muni = 999 and @prov = 99)]">
          <xsl:variable name="prov_cod"><xsl:value-of select="@prov" /></xsl:variable>
          <xsl:variable name="tipo"><xsl:value-of select="@tipo" /></xsl:variable>

          <xsl:element name="lugar">
            <xsl:attribute name="id"><xsl:value-of select="$prov_cod"/></xsl:attribute>
            <xsl:attribute name="nombre"><xsl:value-of select="nombre"/></xsl:attribute>
            <xsl:attribute name="provincia_id"><xsl:value-of select="$prov_cod"/></xsl:attribute>
            <xsl:attribute name="tipo"><xsl:value-of select="@tipo"/></xsl:attribute>

            <xsl:for-each select="//porLista/lugar[@tipo = $tipo and @prov = $prov_cod and nombre/@muni = 999]/formula[@id != '00000000']">
              <xsl:sort select="@p" order="descending" data-type="number"/>
              <xsl:variable name="formulaId"><xsl:value-of select="@id"/></xsl:variable>
              
              <xsl:element name="formula">
                <xsl:attribute name="id"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@id"/></xsl:attribute>
                <xsl:attribute name="nombre"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@nombre" /></xsl:attribute>
                <xsl:attribute name="orden"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@orden" /></xsl:attribute>
                <xsl:attribute name="candidato"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@candidato" /></xsl:attribute>
                <xsl:attribute name="title"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@title" /></xsl:attribute>
                <xsl:attribute name="class"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@class" /></xsl:attribute>
                <xsl:attribute name="img"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@img" /></xsl:attribute>
                <xsl:attribute name="p"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="@p" /></xsl:call-template></xsl:attribute>
              </xsl:element>
            </xsl:for-each>
<!--
            <xsl:for-each select="//porLista/lugar[@tipo = $tipo and @prov = $prov_cod and nombre/@muni = 999]">
              <xsl:sort select="formula/@p" order="descending" data-type="number"/>
              <xsl:variable name="formulaId"><xsl:value-of select="formula/@id"/></xsl:variable>
              
              <xsl:element name="formula">
                <xsl:attribute name="id"><xsl:value-of select="$formulaId"/></xsl:attribute>
                <xsl:attribute name="nombre"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@nombre" /></xsl:attribute>
                <xsl:attribute name="orden"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@orden" /></xsl:attribute>
                <xsl:attribute name="candidato"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@candidato" /></xsl:attribute>
                <xsl:attribute name="title"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@title" /></xsl:attribute>
                <xsl:attribute name="class"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@class" /></xsl:attribute>
                <xsl:attribute name="img"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@img" /></xsl:attribute>
                <xsl:attribute name="p"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="formula/@p" /></xsl:call-template></xsl:attribute>
              </xsl:element>
            </xsl:for-each>
-->            
            <xsl:element name="totales">
              <xsl:attribute name="mesasEscrutadas"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="//totales/lugar[@prov = $prov_cod and @tipo = $tipo and nombre/@muni = 999]/mesas/@p" /></xsl:call-template></xsl:attribute>
              <xsl:attribute name="concurrencia"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="//totales/lugar[@prov = $prov_cod and @tipo = $tipo and nombre/@muni = 999 ]/electores/@pVE" /></xsl:call-template></xsl:attribute>
            </xsl:element>
            
          </xsl:element>
        </xsl:for-each>
      </xsl:element>
    </xsl:template>
  
  <!-- substring("12345",2,3) returns "234" -->
  <!-- substring("12345",2) returns "2345" -->
  

  <xsl:template name="porcentaje"><!--
  --><xsl:param name="num" select="formula/@p"/><!--
  --><xsl:variable name="numEntero"><xsl:value-of select="substring($num,0,string-length($num)-1)"/></xsl:variable><!--  
        --><xsl:variable name="numDecimales"><xsl:value-of select="substring($num,string-length($num)-1)"/></xsl:variable>
          <xsl:variable name="numTemp" >
            <xsl:choose>
              <xsl:when test="number($numEntero) &gt;= 100">
                <xsl:value-of select="concat('100',',','00')"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="concat(number($numEntero),',',$numDecimales)"/>      
              </xsl:otherwise>
            </xsl:choose>
          </xsl:variable>
          <xsl:value-of select="$numTemp"/>        
    </xsl:template>
  <!-- xsl:value-of select="number(concat($numEntero,'.',$numDecimales))"/ -->

  
  
  <!--
    <elecciones>
       <lugar id="2" nombre="Bs.As." provincia_id="2" tipo="4">
        <formula id="1" nombre="FPV" candidato="CFK" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="64.00" />
        <formula id="2" nombre="UDS" candidato="RA" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="54.00" />
        <formula id="3" nombre="UP1" candidato="ED" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="44.00" />
        <formula id="4" nombre="UP" candidato="HB" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="34.00" />
        <formula id="5" nombre="El mismo partido que Carrio" candidato="El candidato de Carrio en prov" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="14.00"  />
        <formula id="6" nombre="FPV" candidato="CFK" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="4.00" />

        <totales mesasEscrutadas="50.30" concurrencia="70.58"/>

      </lugar>
      <lugar id="99"  nombre="Total País" provincia_id="99" tipo="1">
        <formula id="1" nombre="FPV" candidato="CFK" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="63.00" />
        <formula id="2" nombre="UDS" candidato="RA" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="53.00" />
        <formula id="3" nombre="UP1" candidato="ED" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="43.00" />
        <formula id="4" nombre="UP" candidato="HB" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="33.00" />
        <formula id="5" nombre="FPV" candidato="CFK" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="13.00" />
        <formula id="6" nombre="FPV" candidato="CFK" title="XXXXXXX" class="XXXXXXXX" img="/_ui/desktop/imgs/varios/elecciones-primarias/XXXXXXXXXXXXXX.png" p="3.00" />

        <totales mesasEscrutadas="50.30" concurrencia="70.58"/>

      </lugar>
    </elecciones>
  -->
  
</xsl:stylesheet>