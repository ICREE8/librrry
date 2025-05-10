'use client';

import { useState } from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import ArrowSvg from './svg/ArrowSvg';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';

// Componente para el formulario de registro de vehículos
const VehiculoForm = () => {
  const [formData, setFormData] = useState({
    vehiculo: {
      categoria: {
        tipo: '',
        marca: '',
      },
      imagenes: [],
      titulo: '',
      descripcion: '',
      contacto: '',
      condicion: '',
      precio: {
        valor: '',
        tipoPrecio: '',
        promocion: false,
        aceptaPermuta: false,
        financiacion: false,
      },
      kilometraje: '',
      cilindraje: '',
      combustible: '',
      color: '',
      transmision: '',
      blindado: '',
      peritaje: {
        tiene: false,
        documento: null,
      },
      ubicacion: {
        departamento: '',
        municipio: '',
      },
      aceptaTerminos: false,
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // Tipos de vehículos y otras opciones
  const tiposVehiculo = ['Automóvil', 'Camioneta', 'Motocicleta', 'Camión', 'Otro'];
  const marcasVehiculo = ['Toyota', 'Mazda', 'Renault', 'Chevrolet', 'Nissan', 'Honda', 'Kia', 'Otro'];
  const condiciones = ['Nuevo', 'Usado'];
  const tiposPrecio = ['Fijo', 'Negociable'];
  const combustibles = ['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido', 'Gas'];
  const transmisiones = ['Manual', 'Automática'];
  const opcionesSiNo = ['Sí', 'No'];
  const departamentos = ['Antioquia', 'Valle del Cauca', 'Cundinamarca', 'Atlántico', 'Otro'];
  const municipios = {
    'Antioquia': ['Medellín', 'Envigado', 'Itagüí', 'Otro'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Otro'],
    'Cundinamarca': ['Bogotá', 'Soacha', 'Chía', 'Otro'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Otro'],
    'Otro': ['Otro']
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type, checked, files } = e.target as HTMLInputElement;
      const nameParts: (keyof typeof formData)[] = name.split('.') as (keyof typeof formData)[];

    if (nameParts.length === 1) {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files : value
      });
    } else if (nameParts.length === 2) {
      setFormData({
        ...formData,
        [nameParts[0]]: {
          ...formData[nameParts[0]],
          [nameParts[1] as keyof typeof formData['vehiculo']]: type === 'checkbox' ? checked : type === 'file' ? files : value
        }
      });
    } else if (nameParts.length === 3) {
      setFormData({
        ...formData,
        [nameParts[0]]: {
          ...formData[nameParts[0]],
          [nameParts[1] as keyof typeof formData['vehiculo']]: {
            ...formData[nameParts[0]][nameParts[1]],
            [nameParts[2]]: type === 'checkbox' ? checked : type === 'file' ? files : value
          }
        }
      });
    }
  };

  // Maneja la carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      vehiculo: {
        ...formData.vehiculo,
        imagenes: files
      }
    });
  };

  // Valida el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    const v = formData.vehiculo;

    // Validaciones obligatorias
    if (!v.categoria.tipo) newErrors['vehiculo.categoria.tipo'] = 'Tipo de vehículo obligatorio';
    if (!v.categoria.marca) newErrors['vehiculo.categoria.marca'] = 'Marca obligatoria';
    if (!v.titulo) newErrors['vehiculo.titulo'] = 'Título obligatorio';
    if (!v.descripcion) newErrors['vehiculo.descripcion'] = 'Descripción obligatoria';
    if (!v.contacto) newErrors['vehiculo.contacto'] = 'Contacto obligatorio';
    if (!v.condicion) newErrors['vehiculo.condicion'] = 'Condición obligatoria';
    if (!v.precio.valor) newErrors['vehiculo.precio.valor'] = 'Valor obligatorio';
    if (!v.precio.tipoPrecio) newErrors['vehiculo.precio.tipoPrecio'] = 'Tipo de precio obligatorio';
    if (!v.kilometraje) newErrors['vehiculo.kilometraje'] = 'Kilometraje obligatorio';
    if (!v.cilindraje) newErrors['vehiculo.cilindraje'] = 'Cilindraje obligatorio';
    if (!v.combustible) newErrors['vehiculo.combustible'] = 'Combustible obligatorio';
    if (!v.color) newErrors['vehiculo.color'] = 'Color obligatorio';
    if (!v.transmision) newErrors['vehiculo.transmision'] = 'Transmisión obligatoria';
    if (!v.blindado) newErrors['vehiculo.blindado'] = 'Debe especificar si es blindado';
    if (!v.ubicacion.departamento) newErrors['vehiculo.ubicacion.departamento'] = 'Departamento obligatorio';
    if (!v.ubicacion.municipio) newErrors['vehiculo.ubicacion.municipio'] = 'Municipio obligatorio';
    
    // Validación de imágenes (5-15)
    if (!v.imagenes || v.imagenes.length < 5) {
      newErrors['vehiculo.imagenes'] = 'Debe subir al menos 5 imágenes';
    } else if (v.imagenes.length > 15) {
      newErrors['vehiculo.imagenes'] = 'No puede subir más de 15 imágenes';
    }
    
    // Validación de peritaje
    if (v.peritaje.tiene && !v.peritaje.documento) {
      newErrors['vehiculo.peritaje.documento'] = 'Documento de peritaje obligatorio';
    }
    
    // Validación de términos y condiciones
    if (!v.aceptaTerminos) {
      newErrors['vehiculo.aceptaTerminos'] = 'Debe aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitStatus('sending');
      
      try {
        // Aquí iría la lógica para enviar los datos y tokenizar el vehículo
        // Simularemos un proceso asíncrono
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSubmitStatus('success');
        console.log('Datos enviados:', formData);
      } catch (error) {
        setSubmitStatus('error');
        console.error('Error al enviar:', error);
      }
    } else {
      console.log('Formulario inválido');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Tokenizar mi Vehículo
      </h2>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">¡Registro Exitoso!</p>
          <p>Tu vehículo ha sido registrado para tokenización. Pronto recibirás un correo con los siguientes pasos.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección: Información básica */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Información básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de vehículo *
                </label>
                <select 
                  name="vehiculo.categoria.tipo"
                  value={formData.vehiculo.categoria.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione tipo</option>
                  {tiposVehiculo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors['vehiculo.categoria.tipo'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.categoria.tipo']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Marca *
                </label>
                <select 
                  name="vehiculo.categoria.marca"
                  value={formData.vehiculo.categoria.marca}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione marca</option>
                  {marcasVehiculo.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
                {errors['vehiculo.categoria.marca'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.categoria.marca']}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título del anuncio *
                </label>
                <input 
                  type="text"
                  name="vehiculo.titulo"
                  value={formData.vehiculo.titulo}
                  onChange={handleChange}
                  placeholder="Ej. Toyota Corolla 2022 en excelente estado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['vehiculo.titulo'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.titulo']}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción *
                </label>
                <textarea 
                  name="vehiculo.descripcion"
                  value={formData.vehiculo.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describa las características principales de su vehículo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {errors['vehiculo.descripcion'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.descripcion']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Fotos */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Fotos del vehículo</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Imágenes * (mínimo 5, máximo 15)
              </label>
              <input 
                type="file"
                name="vehiculo.imagenes"
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.vehiculo.imagenes.length} imagen(es) seleccionada(s)
              </p>
              {errors['vehiculo.imagenes'] && (
                <p className="text-red-500 text-xs mt-1">{errors['vehiculo.imagenes']}</p>
              )}
            </div>
          </div>

          {/* Sección: Estado y precio */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Estado y precio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condición *
                </label>
                <select 
                  name="vehiculo.condicion"
                  value={formData.vehiculo.condicion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione condición</option>
                  {condiciones.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
                {errors['vehiculo.condicion'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.condicion']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio (USD) *
                </label>
                <input 
                  type="number"
                  name="vehiculo.precio.valor"
                  value={formData.vehiculo.precio.valor}
                  onChange={handleChange}
                  placeholder="Ej. 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['vehiculo.precio.valor'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.precio.valor']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de precio *
                </label>
                <select 
                  name="vehiculo.precio.tipoPrecio"
                  value={formData.vehiculo.precio.tipoPrecio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione tipo</option>
                  {tiposPrecio.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors['vehiculo.precio.tipoPrecio'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.precio.tipoPrecio']}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="promocion"
                    name="vehiculo.precio.promocion"
                    checked={formData.vehiculo.precio.promocion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="promocion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    En promoción
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="permuta"
                    name="vehiculo.precio.aceptaPermuta"
                    checked={formData.vehiculo.precio.aceptaPermuta}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="permuta" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Acepta permuta
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    id="financiacion"
                    name="vehiculo.precio.financiacion"
                    checked={formData.vehiculo.precio.financiacion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="financiacion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Financiación
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Características del vehículo */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Características del vehículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kilometraje *
                </label>
                <input 
                  type="number"
                  name="vehiculo.kilometraje"
                  value={formData.vehiculo.kilometraje}
                  onChange={handleChange}
                  placeholder="Ej. 25000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['vehiculo.kilometraje'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.kilometraje']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cilindraje (cc) *
                </label>
                <input 
                  type="number"
                  name="vehiculo.cilindraje"
                  value={formData.vehiculo.cilindraje}
                  onChange={handleChange}
                  placeholder="Ej. 1600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['vehiculo.cilindraje'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.cilindraje']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Combustible *
                </label>
                <select 
                  name="vehiculo.combustible"
                  value={formData.vehiculo.combustible}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione combustible</option>
                  {combustibles.map(comb => (
                    <option key={comb} value={comb}>{comb}</option>
                  ))}
                </select>
                {errors['vehiculo.combustible'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.combustible']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color *
                </label>
                <input 
                  type="text"
                  name="vehiculo.color"
                  value={formData.vehiculo.color}
                  onChange={handleChange}
                  placeholder="Ej. Rojo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['vehiculo.color'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.color']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transmisión *
                </label>
                <select 
                  name="vehiculo.transmision"
                  value={formData.vehiculo.transmision}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione transmisión</option>
                  {transmisiones.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
                {errors['vehiculo.transmision'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.transmision']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blindado *
                </label>
                <select 
                  name="vehiculo.blindado"
                  value={formData.vehiculo.blindado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione opción</option>
                  {opcionesSiNo.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
                {errors['vehiculo.blindado'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.blindado']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Peritaje */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Peritaje</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="tienePenitaje"
                  name="vehiculo.peritaje.tiene"
                  checked={formData.vehiculo.peritaje.tiene}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="tienePenitaje" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  El vehículo cuenta con peritaje
                </label>
              </div>
              
              {formData.vehiculo.peritaje.tiene && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Documento de peritaje *
                  </label>
                  <input 
                    type="file"
                    name="vehiculo.peritaje.documento"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors['vehiculo.peritaje.documento'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['vehiculo.peritaje.documento']}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sección: Ubicación */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Ubicación del vehículo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Departamento *
                </label>
                <select 
                  name="vehiculo.ubicacion.departamento"
                  value={formData.vehiculo.ubicacion.departamento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione departamento</option>
                  {departamentos.map(depto => (
                    <option key={depto} value={depto}>{depto}</option>
                  ))}
                </select>
                {errors['vehiculo.ubicacion.departamento'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.ubicacion.departamento']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Municipio *
                </label>
                <select 
                  name="vehiculo.ubicacion.municipio"
                  value={formData.vehiculo.ubicacion.municipio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.vehiculo.ubicacion.departamento}
                >
                  <option value="">Seleccione municipio</option>
                  {formData.vehiculo.ubicacion.departamento && 
                    municipios[formData.vehiculo.ubicacion.departamento]?.map(muni => (
                      <option key={muni} value={muni}>{muni}</option>
                    ))}
                </select>
                {errors['vehiculo.ubicacion.municipio'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['vehiculo.ubicacion.municipio']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Contacto */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Información de contacto</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contacto *
              </label>
              <input 
                type="text"
                name="vehiculo.contacto"
                value={formData.vehiculo.contacto}
                onChange={handleChange}
                placeholder="Ej. +57 3XX XXX XXXX o ejemplo@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors['vehiculo.contacto'] && (
                <p className="text-red-500 text-xs mt-1">{errors['vehiculo.contacto']}</p>
              )}
            </div>
          </div>

          {/* Sección: Términos y condiciones */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="aceptaTerminos"
                name="vehiculo.aceptaTerminos"
                checked={formData.vehiculo.aceptaTerminos}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="aceptaTerminos" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Acepto los términos y condiciones de tokenización de vehículos en Carp2p *
              </label>
            </div>
            {errors['vehiculo.aceptaTerminos'] && (
              <p className="text-red-500 text-xs mt-1">{errors['vehiculo.aceptaTerminos']}</p>
            )}
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitStatus === 'sending'}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-400"
            >
              {submitStatus === 'sending' ? 'Procesando...' : 'Tokenizar Vehículo'}
            </button>
          </div>
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              <p className="font-bold">Error al procesar el registro</p>
              <p>Por favor, inténtalo de nuevo más tarde o contacta a soporte.</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

// Componente principal de la aplicación
export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gray-900 dark:text-white bg-gray-100 text-black">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Carp2p</h1>
            <span className="ml-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Base Batches</span>
          </div>
          <div className="wallet-container">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">Tokenización de Vehículos en Blockchain</h2>
            <p className="text-blue-700 dark:text-blue-300">
              Carp2p te permite tokenizar tu vehículo en la blockchain para garantizar compras y ventas seguras. 
              Nuestro sistema asegura el traspaso mediante contratos inteligentes en Base, evitando fraudes y simplificando 
              el proceso de transferencia de propiedad.
            </p>
          </div>
          
          <VehiculoForm />
          
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">¿Por qué tokenizar tu vehículo?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Seguridad Garantizada</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Los contratos inteligentes aseguran que tanto comprador como vendedor cumplan sus obligaciones antes de finalizar la transacción.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Historial Inmutable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Todas las transacciones y cambios de propietario quedan registrados permanentemente en la blockchain de Base.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Proceso Simplificado</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Olvídate de intermediarios y procesos burocráticos. El traspaso se realiza de manera automatizada y segura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Carp2p - Base Batches Buildathon</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}