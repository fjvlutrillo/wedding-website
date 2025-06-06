'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

interface Venue {
    id: string
    name: string
    location: string
    quote_price: number
    quote_price_per_person: number
    catering: boolean
    open_bar: boolean
    open_bar_price: number
    byob: boolean
    flowers: boolean
    available_date: string
    available_date2: string
    notes: string
    rating_user1: number
    rating_user2: number
    images: string[]
    file_url: string[]
    type: string
    created_by: string
}

const formatCurrency = (amount?: number) =>
    amount !== undefined && amount !== null
        ? `$${amount.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).replace('$', '')}`
        : ''

{/* Regex to clean the filenames */ }
const sanitizeFileName = (filename: string) => {
    return filename
        .toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/[^a-z0-9.\-_]/g, '') // Remove non-alphanumeric except dots and dashes
}

const VenuePage = () => {
    {/* State Hooks */ }
    const { type } = useParams()
    const [venues, setVenues] = useState<Venue[]>([])
    const [session, setSession] = useState<any>(null)
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
    const [form, setForm] = useState<Partial<Venue>>({})
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newVenue, setNewVenue] = useState<Partial<Venue>>({})
    const [venueId, setVenueId] = useState<string | null>(null)
    const [showDetails, setShowDetails] = useState<Venue | null>(null)
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOption, setFilterOption] = useState('');
    const [sortOption, setSortOption] = useState('none');

    const router = useRouter()


    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession()
            setSession(data.session)
            if (!data.session) {
                router.push('/login') // 👈 redirects to login if no session
            }
        }
        fetchSession()
        fetchVenues()
    }, [type])
    
    const fetchVenues = async () => {
        const { data } = await supabase.from('venues').select('*').eq('type', type)
        if (data) {
            const updatedVenues = await Promise.all(
                data.map(async (venue) => {
                    const updatedImages = await Promise.all(
                        (venue.images || []).map(async (path: string) => {
                            const { data: signedUrlData, error } = await supabase
                                .storage
                                .from('venue-images')
                                .createSignedUrl(path, 3600)
                            if (error) {
                                console.error('Error generating signed URL for image:', error.message)
                                return path
                            }
                            return signedUrlData.signedUrl
                        })
                    )

                    const updatedFileURLs = await Promise.all(
                        (venue.file_url || []).map(async (path: string) => {
                            const { data: signedUrlData, error } = await supabase
                                .storage
                                .from('venue-images')
                                .createSignedUrl(path, 3600)
                            if (error) {
                                console.error('Error generating signed URL for PDF:', error.message)
                                return path
                            }
                            return signedUrlData.signedUrl
                        })
                    )

                    return { ...venue, images: updatedImages, file_url: updatedFileURLs }
                })
            )
            setVenues(updatedVenues)
        }
    }


    {/* Delete venue funtion */ }
    const handleDelete = async (id: string) => {
        const confirmed = confirm('¿Estás seguro de eliminar este lugar?')
        if (!confirmed) return
        await supabase.from('venues').delete().eq('id', id)
        fetchVenues()
    }

    {/* update venue function */ }
    const handleUpdate = async () => {
        if (!selectedVenue) return;

        const { error } = await supabase
            .from('venues')
            .update({
                name: selectedVenue.name,
                location: selectedVenue.location,
                quote_price: selectedVenue.quote_price,
                quote_price_per_person: selectedVenue.quote_price_per_person,
                notes: selectedVenue.notes,
                available_date: selectedVenue.available_date,
                available_date2: selectedVenue.available_date2,
                images: selectedVenue.images,
                file_url: selectedVenue.file_url,
                // add any other fields here if you later expand your form
            })
            .eq('id', selectedVenue.id);

        if (error) {
            console.error('Error updating venue:', error.message);
            alert('Error al actualizar el lugar');
        } else {
            setSelectedVenue(null);
            fetchVenues();
        }
    };

    {/* upload images function */ }
    const handleImageUpload = async (file: File, venueId: string, callback: (url: string) => void) => {
        const maxSizeMB = 10; // for example, 10MB

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`El archivo es demasiado grande. Tamaño máximo permitido: ${maxSizeMB}MB.`);
            return;
        }

        const safeFileName = sanitizeFileName(file.name)
        const filePath = `${venueId}/${safeFileName}`

        const { error: uploadError } = await supabase
            .storage
            .from('venue-images')
            .upload(filePath, file)
        if (uploadError) {
            console.error('Error uploading image:', uploadError.message)
            alert('Error al subir la imagen')
            return
        }

        const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('venue-images')
            .createSignedUrl(filePath, 60 * 60) // 1 hour validity
        if (signedUrlError) {
            console.error('Error creating signed URL:', signedUrlError.message)
            alert('Error al generar la URL de imagen')
            return
        }

        callback(filePath)
    }

    {/* Upload pdfs */ }
    const handlePdfUpload = async (file: File, venueId: string, callback: (url: string) => void) => {
        const maxSizeMB = 10; // for example, 10MB

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`El archivo es demasiado grande. Tamaño máximo permitido: ${maxSizeMB}MB.`);
            return;
        }

        const safeFileName = sanitizeFileName(file.name)
        const filePath = `${venueId}/${safeFileName}`

        const { error: uploadError } = await supabase
            .storage
            .from('venue-images')
            .upload(filePath, file)
        if (uploadError) {
            console.error('Error uploading PDF:', uploadError.message)
            alert('Error al subir el PDF')
            return
        }

        const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('venue-images')
            .createSignedUrl(filePath, 60 * 60) // 1 hour validity
        if (signedUrlError) {
            console.error('Error creating signed URL:', signedUrlError.message)
            alert('Error al generar la URL de PDF')
            return
        }

        callback(filePath)
    }


    const renderTag = (value: boolean) => (
        <span
            className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
        >
            {value ? 'Sí' : 'No'}
        </span>
    )

    {/* Ratings */ }
    const handleRating = async (venueId: string, rating: number) => {
        const { error } = await supabase
            .from('venues')
            .update({ rating_user1: rating })
            .eq('id', venueId);

        if (error) {
            console.error('Error updating rating:', error.message);
            alert('Error al actualizar la calificación');
        } else {
            fetchVenues(); // Refresh the table after updating
        }
    }

    if (session === null) {
        return <div>Cargando sesión...</div> // Placeholder while loading session
    }

    if (!session) {
        router.push('/login') // Redirect to login page
        return null // Prevent rendering
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold capitalize text-black">Lugares – {type}</h1>
                <button
                    onClick={() => {
                        const newId = uuidv4()
                        setVenueId(newId)
                        setNewVenue({})
                        setShowCreateModal(true)
                    }}
                    className="bg-blue-900 text-white px-4 py-2 rounded"
                >
                    Crear nuevo lugar
                </button>
            </div>
            
            {/* serch box and filters container */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="border p-2 w-full md:w-1/3 mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="border p-2 mb-4 mr-4 text-black"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="catering">Incluye Catering</option>
                    <option value="byob">BYOB</option>
                    <option value="flores">Incluye Flores</option>
                    <option value="open_bar">Barra Libre</option>
                    <option value="rating">Calificación {'>'} 3</option> {/*is it fixed?*/}
                </select>

                <select
                    className="border p-2 mb-4 text-black"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="none">Sin Orden</option>
                    <option value="price_asc">Precio Ascendente</option>
                    <option value="price_desc">Precio Descendente</option>
                </select>
             </div>

            {/* Venue tables */}
            <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                    <thead className="bg-blue-950 text-white">
                        <tr>
                            {/*<th className="p-2 border">Imagen</th> // had to comment images out. */} 
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Ubicación</th>
                            <th className="p-2 border">Precio Total</th>
                            <th className="p-2 border">Precio por Persona</th>
                            <th className="p-2 border">Catering</th>
                            <th className="p-2 border">Barra Libre</th>
                            <th className="p-2 border">BYOB</th>
                            <th className="p-2 border">Flores</th>
                            <th className="p-2 border">Calificación</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {venues
                            .filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .filter((v) => {
                                if (filterOption === 'catering') return v.catering;
                                if (filterOption === 'byob') return v.byob;
                                if (filterOption === 'flores') return v.flowers;
                                if (filterOption === 'open_bar') return v.open_bar;
                                if (filterOption === 'rating') return v.rating_user1 > 3;
                                return true;
                            })
                            .sort((a, b) => {
                                if (sortOption === 'price_asc') return a.quote_price - b.quote_price;
                                if (sortOption === 'price_desc') return b.quote_price - a.quote_price;
                                return 0;
                            })
                            .map((v) => (
                                <tr key={v.id} className="hover:bg-gray-100 align-top">

                                    {/*
                                    <td className="border p-2 text-black">
                                        {v.images?.[0] ? (
                                            <img
                                                src={v.images[0]}
                                                className="w-14 h-10 object-cover rounded cursor-pointer"
                                                onClick={() => {
                                                    setSelectedImages(v.images)
                                                    setSelectedImageIndex(0)
                                                }}
                                            />
                                        ) : (
                                            'Sin imagen'
                                        )}
                                    </td>
                                    */}
                                    <td
                                        className="border p-2 text-blue-700 cursor-pointer underline"
                                        onClick={() => setShowDetails(v)}
                                    >
                                        {v.name}
                                    </td>
                                    
                                    <td className="border p-2 text-black">
                                        {v.location ? (
                                            <a
                                                href={v.location}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 underline"
                                            >
                                                {v.location}
                                            </a>
                                        ) : (
                                            'Sin ubicación'
                                        )}
                                    </td>
                                    <td className="border p-2 text-black">{formatCurrency(v.quote_price)}</td>
                                    <td className="border p-2 text-black">{formatCurrency(v.quote_price_per_person)}</td>
                                    <td className="border p-2 text-black">{renderTag(v.catering)}</td>
                                    <td className="border p-2 text-black">{renderTag(v.open_bar)}</td>
                                    <td className="border p-2 text-black">{renderTag(v.byob)}</td>
                                    <td className="border p-2 text-black">{renderTag(v.flowers)}</td>
                                    <td className="border p-2 text-black">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(v.id, star)}
                                                    className={`${star <= v.rating_user1 ? 'text-yellow-500' : 'text-gray-400'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="border p-2">
                                        <button
                                            className="text-blue-600 mr-2"
                                            onClick={() => {
                                                setForm(v)
                                                setVenueId(v.id)
                                                setSelectedVenue(v)
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-600"
                                            onClick={() => handleDelete(v.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
                    <div className="bg-white p-6 rounded shadow w-full max-w-3xl space-y-4 relative">
                        <button
                            onClick={() => setShowDetails(null)}
                            className="absolute top-4 right-4 text-lg"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-black">{showDetails.name}</h2>
                        {showDetails.images?.[0] ? (
                            <img
                                src={showDetails.images[0]}
                                className="w-32 h-20 object-cover rounded cursor-pointer"
                                onClick={() => {
                                    setSelectedImages(showDetails.images)
                                    setSelectedImageIndex(0)
                                }}
                            />
                        ) : (
                            <p className="text-gray-500">Sin imagen</p>
                        )}
                        <p><strong>Ubicación:</strong> {showDetails.location}</p>
                        <p><strong>Precio Total:</strong> {formatCurrency(showDetails.quote_price)}</p>
                        <p><strong>Precio por Persona:</strong> {formatCurrency(showDetails.quote_price_per_person)}</p>
                        <p><strong>Precio barra libre:</strong> {formatCurrency(showDetails.open_bar_price)}</p>
                        <p><strong>Fecha 1:</strong> {new Date(showDetails.available_date).toLocaleDateString()}</p>
                        <p><strong>Fecha 2:</strong> {new Date(showDetails.available_date2).toLocaleDateString()}</p>
                        <p><strong>Notas:</strong> {showDetails.notes}</p>
                        <div className="flex flex-wrap gap-2">
                            {showDetails.images?.map((img, idx) => (
                                <img key={idx} src={img} alt="Imagen" className="w-24 h-16 object-cover border rounded" />
                            ))}
                        </div>
                        <div>
                            <strong>PDFs:</strong>
                            <ul className="list-disc pl-5">
                                {showDetails.file_url?.map((url, i) => (
                                    <li key={i}>
                                        <a href={url} target="_blank" className="text-blue-700 underline">
                                            PDF {i + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => setShowDetails(null)}
                            className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
                    <div className="bg-white p-6 rounded shadow w-full max-w-3xl space-y-4 relative">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-4 right-4 text-lg"
                        >
                            ✕
                        </button>

                        {/* Window to create a new venue */}
                        <h2 className="text-xl font-bold mb-4">Crear Nuevo Lugar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border p-2"
                                placeholder="Nombre"
                                value={newVenue.name || ''}
                                onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                            />
                            <input
                                className="border p-2"
                                placeholder="Ubicación"
                                value={newVenue.location || ''}
                                onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
                            />
                            <input
                                className="border p-2"
                                type="number"
                                placeholder="Precio Total"
                                value={newVenue.quote_price ?? ''}
                                onChange={(e) => setNewVenue({ ...newVenue, quote_price: +e.target.value })}
                            />
                            <input
                                className="border p-2"
                                type="number"
                                placeholder="Precio por Persona"
                                value={newVenue.quote_price_per_person ?? ''}
                                onChange={(e) => setNewVenue({ ...newVenue, quote_price_per_person: +e.target.value })}
                            />

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newVenue.catering || false}
                                    onChange={(e) => setNewVenue({ ...newVenue, catering: e.target.checked })}
                                />
                                ¿Incluye catering?
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newVenue.open_bar || false}
                                    onChange={(e) => setNewVenue({ ...newVenue, open_bar: e.target.checked })}
                                />
                                ¿Barra libre?
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newVenue.byob || false}
                                    onChange={(e) => setNewVenue({ ...newVenue, byob: e.target.checked })}
                                />
                                ¿BYOB?
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newVenue.flowers || false}
                                    onChange={(e) => setNewVenue({ ...newVenue, flowers: e.target.checked })}
                                />
                                ¿Incluye decoración?
                            </label>
                            <textarea
                                className="border p-2 md:col-span-2"
                                placeholder="Notas"
                                value={newVenue.notes || ''}
                                onChange={(e) => setNewVenue({ ...newVenue, notes: e.target.value })}
                            />
                            <div className='mb-4'>
                                <label htmlFor='available_date' className='block text-sm font-medium text-gray-700'>
                                    Fecha disponible
                                </label>
                                <input
                                    className="border p-2"
                                    type="date"
                                    placeholder="Fecha disponible"
                                    value={newVenue.available_date || ''}
                                    onChange={(e) => setNewVenue({ ...newVenue, available_date: e.target.value })}
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='available_date2' className='block text-sm font-medium text-gray-700'>
                                    Segunda fecha disponible
                                </label>
                                <input
                                    className="border p-2"
                                    type="date"
                                    placeholder="Fecha 2 disponible"
                                    value={newVenue.available_date2 || ''}
                                    onChange={(e) => setNewVenue({ ...newVenue, available_date2: e.target.value })}
                                />
                            </div>

                            {/* Image Upload */}
                            <p className="font-semibold">Subir imágenes (JPG, PNG, etc.)</p>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (files && venueId) {
                                        Array.from(files).forEach(file => {
                                            handleImageUpload(file, venueId, (url) => {
                                                setNewVenue((prev) => ({
                                                    ...prev,
                                                    images: [...(prev.images || []), url]
                                                }))
                                            })
                                        })
                                    }
                                }}
                            />


                            {/* PDF Upload */}
                            <p className="font-semibold">Subir PDFs (cotizaciones, documentos, etc.)</p>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file && venueId) {
                                        handlePdfUpload(file, venueId, (url) => {
                                            setNewVenue((prev) => ({
                                                ...prev,
                                                file_url: [...(prev.file_url || []), url]
                                            }))
                                        })
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="bg-green-700 text-white px-4 py-2 rounded"
                            onClick={async () => {
                                if (!session?.user) {
                                    alert('No autenticado')
                                    return
                                }
                                const newId = venueId || uuidv4()
                                const { error } = await supabase.from('venues').insert([{
                                    ...newVenue,
                                    id: newId,
                                    type,
                                    created_by: session.user.id,
                                    rating_user1: 0,
                                    rating_user2: 0,
                                }])
                                if (error) {
                                    console.error('Insert error:', error.message)
                                    alert('Error al crear el lugar')
                                } else {
                                    setShowCreateModal(false)
                                    setNewVenue({})
                                    fetchVenues()
                                }
                            }}
                        >
                            Guardar Lugar
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedVenue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
                    <div className="bg-white p-6 rounded shadow w-full max-w-3xl space-y-4 relative">
                        <button
                            onClick={() => setSelectedVenue(null)}
                            className="absolute top-4 right-4 text-lg"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">Editar Lugar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border p-2"
                                placeholder="Nombre"
                                value={form.name || ''}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                className="border p-2"
                                placeholder="Ubicación"
                                value={form.location || ''}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                            <input
                                className="border p-2"
                                type="number"
                                placeholder="Precio Total"
                                value={form.quote_price ?? ''}
                                onChange={(e) => setForm({ ...form, quote_price: +e.target.value })}
                            />
                            <input
                                className="border p-2"
                                type="number"
                                placeholder="Precio por Persona"
                                value={form.quote_price_per_person ?? ''}
                                onChange={(e) => setForm({ ...form, quote_price_per_person: +e.target.value })}
                            />

                            <div className="mb-4">
                                <label htmlFor="edit_notes" className="block text-sm font-medium text-gray-700">
                                    Notas
                                </label>
                                <textarea
                                    id="edit_notes"
                                    className="border p-2 w-full"
                                    value={selectedVenue.notes || ''}
                                    onChange={(e) => setSelectedVenue({ ...selectedVenue, notes: e.target.value })}
                                    rows={4}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="edit_available_date" className="block text-sm font-medium text-gray-700">
                                    Fecha Disponible
                                </label>
                                <input
                                    id="edit_available_date"
                                    className="border p-2 w-full"
                                    type="date"
                                    value={selectedVenue.available_date || ''}
                                    onChange={(e) => setSelectedVenue({ ...selectedVenue, available_date: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="edit_available_date2" className="block text-sm font-medium text-gray-700">
                                    Fecha 2 Disponible
                                </label>
                                <input
                                    id="edit_available_date2"
                                    className="border p-2 w-full"
                                    type="date"
                                    value={selectedVenue.available_date2 || ''}
                                    onChange={(e) => setSelectedVenue({ ...selectedVenue, available_date2: e.target.value })}
                                />
                            </div>

                            {/* Image Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (files && venueId) {
                                        Array.from(files).forEach(file => {
                                            handleImageUpload(file, venueId, (url) => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    images: [...(prev.images || []), url]
                                                }))
                                            })
                                        })
                                    }
                                }}
                            />


                            {/* PDF Upload */}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file && venueId) {
                                        handlePdfUpload(file, venueId, (url) => {
                                            setForm((prev) => ({
                                                ...prev,
                                                file_url: [...(prev.file_url || []), url]
                                            }))
                                        })
                                    }
                                }}
                            />
                        </div>
                        <button
                            className="bg-blue-700 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            )}
            {/* Fullscreen Image Modal */}
            {selectedImages.length > 0 && selectedImageIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
                    <div className="relative">
                        <button
                            onClick={() => {
                                setSelectedImages([])
                                setSelectedImageIndex(null)
                            }}
                            className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded"
                        >
                            ✕
                        </button>
                        <img
                            src={selectedImages[selectedImageIndex]}
                            alt={`Imagen ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-screen rounded"
                        />
                        {/* Prev Button */}
                        {selectedImageIndex > 0 && (
                            <button
                                onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black px-3 py-1 rounded"
                            >
                                ◀
                            </button>
                        )}
                        {/* Next Button */}
                        {selectedImageIndex < selectedImages.length - 1 && (
                            <button
                                onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black px-3 py-1 rounded"
                            >
                                ▶
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default VenuePage