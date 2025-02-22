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

