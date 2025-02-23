/*
 * Copyright 2024 [Tu Nombre o Empresa]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import{createClient} from 'jsr:@supabase/supabase-js@2';

const form = document.getElementById("form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const supabase = createClient(
        'https://fklqhqagyyrmsmhksgct.supabase.co',  // Reemplaza con tu URL de Supabase
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbHFocWFneXlybXNtaGtzZ2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjYwOTAsImV4cCI6MjA1NTgwMjA5MH0.8pIc0wosjnUVrkJDw-4VjtxTnpYexgzcMG3qHWfI_eE' // Reemplaza con tu Anon Key
    );
    let email = document.getElementById("username").value;
    let password = document.getElementById("password").value; 
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    console.log(data);

});

