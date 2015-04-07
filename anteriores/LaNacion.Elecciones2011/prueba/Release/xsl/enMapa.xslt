<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/xml">
      <xsl:element name="elecciones">
        <xsl:for-each select="totales/lugar[@tipo = 1 and nombre/@muni = 999]">
          <xsl:variable name="prov_cod"><xsl:value-of select="@prov" /></xsl:variable>
          <xsl:variable name="tipo" select="@tipo" />
          <xsl:element name="lugar">
            <xsl:attribute name="id"><xsl:value-of select="$prov_cod"/></xsl:attribute>
            <xsl:attribute name="nombre"><xsl:value-of select="nombre"/></xsl:attribute>

            <xsl:for-each select="//porLista/lugar[@tipo = 1 and @prov = $prov_cod and nombre/@muni = 999]">
              <xsl:sort select="formula/@p" order="descending" data-type="number"/>
              <xsl:variable name="formulaId"><xsl:value-of select="formula/@id"/></xsl:variable>
              <xsl:element name="formula">
                <xsl:attribute name="id"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@id"/></xsl:attribute>
                <xsl:attribute name="orden"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@orden" /></xsl:attribute>
                <xsl:attribute name="nombre"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@nombre" /></xsl:attribute>
                <xsl:attribute name="candidato"><xsl:value-of select="//formulas/formula[@formula_id = $formulaId and @eleccion_id=$tipo]/@candidato" /></xsl:attribute>
                <xsl:attribute name="p"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="formula/@p" /></xsl:call-template></xsl:attribute>
              </xsl:element>
            </xsl:for-each>
            
          </xsl:element>  
        </xsl:for-each>
        
        <xsl:element name="totales">
            <xsl:attribute name="mesasEscrutadas"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="//totales/lugar[@prov = 99]/mesas/@p" /></xsl:call-template></xsl:attribute>
            <xsl:attribute name="concurrencia"><xsl:call-template name="porcentaje"><xsl:with-param name="num" select="//totales/lugar[@prov = 99]/electores/@pVE" /></xsl:call-template></xsl:attribute>
        </xsl:element>
      </xsl:element>
    </xsl:template>

    <!-- xsl:value-of select="number(concat($numEntero,'.',$numDecimales))"/ -->

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

  
</xsl:stylesheet>