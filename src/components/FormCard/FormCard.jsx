// React
import React, { useState } from 'react'; // FIX: useState importado

// Estilos
import './FormCard.css';

// Funciones
import { progressBar } from '../../functions/progessBar';

const FormCard = ({ title, onSubmit, register, errors, fields, buttons, password, setPassword }) => {

    return (
        <div className="containerLR">

            <h2>{title}</h2>

            <form onSubmit={onSubmit}>

                {fields.map(({ name, label, type = "text", placeholder }) => (
                    <div key={name} className="form-group">
                        <label htmlFor={name}>{label}</label>
                        <input
                            {...register(name)}
                            type={type}
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            required
                            onChange={(e) => {
                                if (name === 'password') {
                                    setPassword(e.target.value);
                                }
                            }}
                        />
                        {type === 'password' && name === 'password' && (
                            <div id="progress-container">
                                {/* FIX: progressBar(length) con "length" indefinido -> progressBar(password?.length ?? 0) */}
                                <div id="progress-bar" style={progressBar(password?.length ?? 0)}></div>
                            </div>
                        )}

                        <p className="text-danger small">{errors[name]?.message}</p>
                    </div>
                ))}

                <div className="form-actions">
                    <button type="submit">Enviar</button>
                    {buttons}
                </div>
            </form>
        </div>
    );
};

export default FormCard;