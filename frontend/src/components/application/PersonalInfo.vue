<template>
  <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-primary animate__animated animate__fadeIn">
    <h2 class="text-xl sm:text-2xl font-bold text-primary-dark mb-6 relative pb-2">
      Informations Personnelles
      <span class="absolute bottom-0 left-0 w-16 h-1 bg-primary-light"></span>
    </h2>

    <form @submit.prevent="submitForm" class="max-w-4xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <!-- Stage Type -->
        <div class="form-group md:col-span-2">
          <label for="stageType" class="form-label flex items-center">
            <i class="fas fa-users text-primary-light mr-2"></i>
            Type de stage <span class="text-red-600 ml-1">*</span>
          </label>
          <select
            id="stageType"
            v-model="form.stageType"
            class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
            :class="{ 'border-red-500 bg-red-50': v$.stageType.$error }"
            @blur="v$.stageType.$touch()"
          >
            <option value="" disabled selected>Sélectionnez le type de stage</option>
            <option value="solo">Solo</option>
            <option value="binome">Binôme</option>
            <option value="groupe">Groupe</option>
          </select>
          <p v-if="v$.stageType.$error" class="error-message">
            <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.stageType.$errors[0].$message }}
          </p>
        </div>

        <!-- Accordion pour le candidat principal -->
        <div class="form-group md:col-span-2 border rounded-lg overflow-hidden">
          <button 
            type="button"
            @click.prevent="toggleAccordion('candidat1')" 
            class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
          >
            <span class="text-lg font-semibold flex items-center">
              <i class="fas fa-user text-primary-light mr-2"></i>
              Candidat 1 (Principal)
            </span>
            <i :class="['fas', accordionStates.candidat1 ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>

          <div v-show="accordionStates.candidat1" class="p-4 space-y-4">
            <!-- Section Upload Photo -->
            <div class="form-group md:col-span-2 mb-8">
              <label class="form-label flex items-center mb-4">
                <i class="fas fa-camera text-primary-light mr-2"></i>
                Photo de profil <span class="text-red-600 ml-1">*</span>
              </label>
              <div class="flex flex-col items-center space-y-4">
                <!-- Zone de prévisualisation -->
                <div class="relative">
                  <div 
                    v-if="!form.profilePhoto" 
                    class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    @click="$refs.fileInput.click()"
                  >
                    <div class="text-center">
                      <i class="fas fa-user text-gray-400 text-3xl mb-2"></i>
                      <p class="text-sm text-gray-500">Cliquez pour ajouter une photo</p>
                    </div>
                  </div>
                  <div v-else class="relative">
                    <img 
                      :src="form.profilePhoto" 
                      alt="Photo de profil" 
                      class="w-32 h-32 rounded-full object-cover border-2 border-primary"
                    />
                    <button 
                      type="button"
                      @click="removePhoto"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </div>
                </div>
                <!-- Bouton d'upload -->
                <div class="flex flex-col sm:flex-row gap-2">
                  <button 
                    type="button"
                    @click="$refs.fileInput.click()"
                    class="btn-outline px-4 py-2 flex items-center justify-center"
                  >
                    <i class="fas fa-upload mr-2"></i>
                    {{ form.profilePhoto ? 'Changer la photo' : 'Choisir une photo' }}
                  </button>
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                  />
                </div>
                <!-- Messages d'erreur et d'aide -->
                <div v-if="photoError" class="text-red-500 text-sm text-center">
                  <i class="fas fa-exclamation-circle mr-1"></i>
                  {{ photoError }}
                </div>
                <div class="text-xs text-gray-500 text-center max-w-md">
                  <i class="fas fa-info-circle mr-1"></i>
                  Formats acceptés : JPG, PNG, GIF. Taille maximale : 5MB. Photo carrée recommandée.
                </div>
              </div>
            </div>
            <!-- First Name -->
            <div class="form-group">
              <label for="firstName" class="form-label flex items-center">
                <i class="fas fa-user text-primary-light mr-2"></i>
                Prénom <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.firstName.$error }"
                @blur="v$.firstName.$touch()"
                placeholder="Votre prénom"
              />
              <p v-if="v$.firstName.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.firstName.$errors[0].$message }}
              </p>
            </div>

            <!-- Last Name -->
            <div class="form-group">
              <label for="lastName" class="form-label flex items-center">
                <i class="fas fa-user text-primary-light mr-2"></i>
                Nom <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.lastName.$error }"
                @blur="v$.lastName.$touch()"
                placeholder="Votre nom"
              />
              <p v-if="v$.lastName.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.lastName.$errors[0].$message }}
              </p>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label flex items-center">
                <i class="fas fa-envelope text-primary-light mr-2"></i>
                Email <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.email.$error }"
                @blur="v$.email.$touch()"
                placeholder="votre.email@exemple.com"
              />
              <p v-if="v$.email.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.email.$errors[0].$message }}
              </p>
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone" class="form-label flex items-center">
                <i class="fas fa-phone-alt text-primary-light mr-2"></i>
                Téléphone <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.phone.$error }"
                @blur="v$.phone.$touch()"
                placeholder="+229 XX XX XX XX"
              />
              <p v-if="v$.phone.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.phone.$errors[0].$message }}
              </p>
            </div>

            <!-- Address -->
            <div class="form-group">
              <label for="address" class="form-label flex items-center">
                <i class="fas fa-map-marker-alt text-primary-light mr-2"></i>
                Adresse <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.address.$error }"
                @blur="v$.address.$touch()"
                placeholder="Votre adresse complète"
              />
              <p v-if="v$.address.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.address.$errors[0].$message }}
              </p>
            </div>

            <!-- City -->
            <div class="form-group">
              <label for="city" class="form-label flex items-center">
                <i class="fas fa-city text-primary-light mr-2"></i>
                Ville <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.city.$error }"
                @blur="v$.city.$touch()"
                placeholder="Votre ville"
              />
              <p v-if="v$.city.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.city.$errors[0].$message }}
              </p>
            </div>

            <!-- Date of Birth -->
            <div class="form-group">
              <label for="dateOfBirth" class="form-label flex items-center">
                <i class="fas fa-birthday-cake text-primary-light mr-2"></i>
                Date de naissance <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="dateOfBirth"
                v-model="form.dateOfBirth"
                type="date"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.dateOfBirth.$error }"
                @blur="v$.dateOfBirth.$touch()"
              />
              <p v-if="v$.dateOfBirth.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.dateOfBirth.$errors[0].$message }}
              </p>
            </div>

            <!-- Nationality -->
            <div class="form-group">
              <label for="nationality" class="form-label flex items-center">
                <i class="fas fa-flag text-primary-light mr-2"></i>
                Nationalité <span class="text-red-600 ml-1">*</span>
              </label>
              <input
                id="nationality"
                v-model="form.nationality"
                type="text"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.nationality.$error }"
                @blur="v$.nationality.$touch()"
                placeholder="Votre nationalité"
              />
              <p v-if="v$.nationality.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.nationality.$errors[0].$message }}
              </p>
            </div>

            <!-- Gender -->
            <div class="form-group">
              <label class="form-label flex items-center mb-2">
                <i class="fas fa-venus-mars text-primary-light mr-2"></i>
                Genre <span class="text-red-600 ml-1">*</span>
              </label>
              <div class="flex flex-wrap gap-4">
                <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="radio"
                    v-model="form.gender"
                    value="male"
                    class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                    @change="v$.gender.$touch()"
                  />
                  <span class="ml-2 text-gray-700 font-medium">
                    <i class="fas fa-male text-blue-500 mr-1"></i> Masculin
                  </span>
                </label>
                <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-primary">
                  <input
                    type="radio"
                    v-model="form.gender"
                    value="female"
                    class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                    @change="v$.gender.$touch()"
                  />
                  <span class="ml-2 text-gray-700 font-medium">
                    <i class="fas fa-female text-pink-500 mr-1"></i> Féminin
                  </span>
                </label>
              </div>
              <p v-if="v$.gender.$error" class="error-message mt-2">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.gender.$errors[0].$message }}
              </p>
            </div>

            <!-- Education Level -->
            <div class="form-group">
              <label for="educationLevel" class="form-label flex items-center">
                <i class="fas fa-graduation-cap text-primary-light mr-2"></i>
                Niveau d'études <span class="text-red-600 ml-1">*</span>
              </label>
              <select
                id="educationLevel"
                v-model="form.educationLevel"
                class="input-field focus:border-primary focus:ring focus:ring-primary-light focus:ring-opacity-30"
                :class="{ 'border-red-500 bg-red-50': v$.educationLevel.$error }"
                @blur="v$.educationLevel.$touch()"
              >
                <option value="" disabled selected>Sélectionnez votre niveau</option>
                <option value="bac">Baccalauréat</option>
                <option value="bac+1">BAC+1</option>
                <option value="bac+2">BAC+2</option>
                <option value="bac+3">BAC+3 (Licence)</option>
                <option value="bac+4">BAC+4</option>
                <option value="bac+5">BAC+5 (Master)</option>
                <option value="doctorate">Doctorat</option>
              </select>
              <p v-if="v$.educationLevel.$error" class="error-message">
                <i class="fas fa-exclamation-circle mr-1"></i> {{ v$.educationLevel.$errors[0].$message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Accordion pour le candidat 2 (si binôme ou groupe) -->
        <div v-if="form.stageType === 'binome' || form.stageType === 'groupe'" class="form-group md:col-span-2 border rounded-lg overflow-hidden mt-4">
          <button 
            type="button"
            @click.prevent="toggleAccordion('candidat2')" 
            class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
          >
            <span class="text-lg font-semibold flex items-center">
              <i class="fas fa-user-friends text-primary-light mr-2"></i>
              Candidat 2
            </span>
            <i :class="['fas', accordionStates.candidat2 ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>

          <div v-show="accordionStates.candidat2" class="p-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="form-group">
                <label for="member2FirstName" class="form-label flex items-center">
                  <i class="fas fa-user text-primary-light mr-2"></i>
                  Prénom <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2FirstName"
                  v-model="form.groupMembers[0].firstName"
                  type="text"
                  class="input-field"
                  placeholder="Prénom du candidat 2"
                />
              </div>

              <!-- Last Name -->
              <div class="form-group">
                <label for="member2LastName" class="form-label flex items-center">
                  <i class="fas fa-user text-primary-light mr-2"></i>
                  Nom <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2LastName"
                  v-model="form.groupMembers[0].lastName"
                  type="text"
                  class="input-field"
                  placeholder="Nom du candidat 2"
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <label for="member2Email" class="form-label flex items-center">
                  <i class="fas fa-envelope text-primary-light mr-2"></i>
                  Email <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2Email"
                  v-model="form.groupMembers[0].email"
                  type="email"
                  class="input-field"
                  placeholder="Email du candidat 2"
                />
              </div>

              <!-- Phone -->
              <div class="form-group">
                <label for="member2Phone" class="form-label flex items-center">
                  <i class="fas fa-phone-alt text-primary-light mr-2"></i>
                  Téléphone <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2Phone"
                  v-model="form.groupMembers[0].phone"
                  type="tel"
                  class="input-field"
                  placeholder="Téléphone du candidat 2"
                />
              </div>

              <!-- Address -->
              <div class="form-group">
                <label for="member2Address" class="form-label flex items-center">
                  <i class="fas fa-map-marker-alt text-primary-light mr-2"></i>
                  Adresse <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2Address"
                  v-model="form.groupMembers[0].address"
                  type="text"
                  class="input-field"
                  placeholder="Adresse du candidat 2"
                />
              </div>

              <!-- City -->
              <div class="form-group">
                <label for="member2City" class="form-label flex items-center">
                  <i class="fas fa-city text-primary-light mr-2"></i>
                  Ville <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2City"
                  v-model="form.groupMembers[0].city"
                  type="text"
                  class="input-field"
                  placeholder="Ville du candidat 2"
                />
              </div>

              <!-- Date of Birth -->
              <div class="form-group">
                <label for="member2DateOfBirth" class="form-label flex items-center">
                  <i class="fas fa-birthday-cake text-primary-light mr-2"></i>
                  Date de naissance <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2DateOfBirth"
                  v-model="form.groupMembers[0].dateOfBirth"
                  type="date"
                  class="input-field"
                />
              </div>

              <!-- Nationality -->
              <div class="form-group">
                <label for="member2Nationality" class="form-label flex items-center">
                  <i class="fas fa-flag text-primary-light mr-2"></i>
                  Nationalité <span class="text-red-600 ml-1">*</span>
                </label>
                <input
                  id="member2Nationality"
                  v-model="form.groupMembers[0].nationality"
                  type="text"
                  class="input-field"
                  placeholder="Nationalité du candidat 2"
                />
              </div>

              <!-- Education Level -->
              <div class="form-group">
                <label for="member2EducationLevel" class="form-label flex items-center">
                  <i class="fas fa-graduation-cap text-primary-light mr-2"></i>
                  Niveau d'études <span class="text-red-600 ml-1">*</span>
                </label>
                <select
                  id="member2EducationLevel"
                  v-model="form.groupMembers[0].educationLevel"
                  class="input-field"
                >
                  <option value="" disabled selected>Sélectionnez le niveau</option>
                  <option value="bac">Baccalauréat</option>
                  <option value="bac+1">BAC+1</option>
                  <option value="bac+2">BAC+2</option>
                  <option value="bac+3">BAC+3 (Licence)</option>
                  <option value="bac+4">BAC+4</option>
                  <option value="bac+5">BAC+5 (Master)</option>
                  <option value="doctorate">Doctorat</option>
                </select>
              </div>

              <!-- Gender -->
              <div class="form-group">
                <label class="form-label flex items-center mb-2">
                  <i class="fas fa-venus-mars text-primary-light mr-2"></i>
                  Genre <span class="text-red-600 ml-1">*</span>
                </label>
                <div class="flex flex-wrap gap-4">
                  <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      v-model="form.groupMembers[0].gender"
                      value="male"
                      class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                    />
                    <span class="ml-2 text-gray-700 font-medium">
                      <i class="fas fa-male text-blue-500 mr-1"></i> Masculin
                    </span>
                  </label>
                  <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      v-model="form.groupMembers[0].gender"
                      value="female"
                      class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                    />
                    <span class="ml-2 text-gray-700 font-medium">
                      <i class="fas fa-female text-pink-500 mr-1"></i> Féminin
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton pour ajouter un candidat supplémentaire (mode groupe uniquement) -->
        <div v-if="form.stageType === 'groupe'" class="form-group md:col-span-2 mt-4">
          <button 
            @click="addGroupMember" 
            type="button"
            class="btn-primary px-4 py-2 flex items-center justify-center w-full sm:w-auto"
          >
            <i class="fas fa-plus-circle mr-2"></i>
            Ajouter un candidat
          </button>
        </div>

        <!-- Candidats supplémentaires pour le mode groupe -->
        <template v-if="form.stageType === 'groupe'">
          <div 
            v-for="(member, index) in form.groupMembers.slice(1)" 
            :key="index + 2"
            class="form-group md:col-span-2 border rounded-lg overflow-hidden mt-4"
          >
            <button 
              @click="toggleAccordion(`candidat${index + 3}`)" 
              class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              <span class="text-lg font-semibold flex items-center">
                <i class="fas fa-user-friends text-primary-light mr-2"></i>
                Candidat {{ index + 3 }}
              </span>
              <div class="flex items-center">
                <button 
                  @click.stop="removeGroupMember(index + 1)" 
                  class="text-red-500 hover:text-red-700 mr-4"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <i :class="['fas', accordionStates[`candidat${index + 3}`] ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </div>
            </button>

            <!-- Contenu identique au candidat 2 -->
            <div v-show="accordionStates[`candidat${index + 3}`]" class="p-4 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="memberFirstName" class="form-label flex items-center">
                    <i class="fas fa-user text-primary-light mr-2"></i>
                    Prénom <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}FirstName`"
                    v-model="member.firstName"
                    type="text"
                    class="input-field"
                    placeholder="Prénom du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberLastName" class="form-label flex items-center">
                    <i class="fas fa-user text-primary-light mr-2"></i>
                    Nom <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}LastName`"
                    v-model="member.lastName"
                    type="text"
                    class="input-field"
                    placeholder="Nom du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberEmail" class="form-label flex items-center">
                    <i class="fas fa-envelope text-primary-light mr-2"></i>
                    Email <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}Email`"
                    v-model="member.email"
                    type="email"
                    class="input-field"
                    placeholder="Email du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberPhone" class="form-label flex items-center">
                    <i class="fas fa-phone-alt text-primary-light mr-2"></i>
                    Téléphone <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}Phone`"
                    v-model="member.phone"
                    type="tel"
                    class="input-field"
                    placeholder="Téléphone du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberAddress" class="form-label flex items-center">
                    <i class="fas fa-map-marker-alt text-primary-light mr-2"></i>
                    Adresse <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}Address`"
                    v-model="member.address"
                    type="text"
                    class="input-field"
                    placeholder="Adresse du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberCity" class="form-label flex items-center">
                    <i class="fas fa-city text-primary-light mr-2"></i>
                    Ville <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}City`"
                    v-model="member.city"
                    type="text"
                    class="input-field"
                    placeholder="Ville du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberDateOfBirth" class="form-label flex items-center">
                    <i class="fas fa-birthday-cake text-primary-light mr-2"></i>
                    Date de naissance <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}DateOfBirth`"
                    v-model="member.dateOfBirth"
                    type="date"
                    class="input-field"
                  />
                </div>
                <div class="form-group">
                  <label for="memberNationality" class="form-label flex items-center">
                    <i class="fas fa-flag text-primary-light mr-2"></i>
                    Nationalité <span class="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    :id="`member${index + 3}Nationality`"
                    v-model="member.nationality"
                    type="text"
                    class="input-field"
                    placeholder="Nationalité du candidat"
                  />
                </div>
                <div class="form-group">
                  <label for="memberEducationLevel" class="form-label flex items-center">
                    <i class="fas fa-graduation-cap text-primary-light mr-2"></i>
                    Niveau d'études <span class="text-red-600 ml-1">*</span>
                  </label>
                  <select
                    :id="`member${index + 3}EducationLevel`"
                    v-model="member.educationLevel"
                    class="input-field"
                  >
                    <option value="" disabled selected>Sélectionnez le niveau</option>
                    <option value="bac">Baccalauréat</option>
                    <option value="bac+1">BAC+1</option>
                    <option value="bac+2">BAC+2</option>
                    <option value="bac+3">BAC+3 (Licence)</option>
                    <option value="bac+4">BAC+4</option>
                    <option value="bac+5">BAC+5 (Master)</option>
                    <option value="doctorate">Doctorat</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label flex items-center mb-2">
                    <i class="fas fa-venus-mars text-primary-light mr-2"></i>
                    Genre <span class="text-red-600 ml-1">*</span>
                  </label>
                  <div class="flex flex-wrap gap-4">
                    <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        :id="`member${index + 3}GenderMale`"
                        v-model="member.gender"
                        value="male"
                        class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                      />
                      <span class="ml-2 text-gray-700 font-medium">
                        <i class="fas fa-male text-blue-500 mr-1"></i> Masculin
                      </span>
                    </label>
                    <label class="relative flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        :id="`member${index + 3}GenderFemale`"
                        v-model="member.gender"
                        value="female"
                        class="h-5 w-5 text-primary focus:ring-primary-light border-gray-300 cursor-pointer"
                      />
                      <span class="ml-2 text-gray-700 font-medium">
                        <i class="fas fa-female text-pink-500 mr-1"></i> Féminin
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Form actions -->
        <div class="mt-8 flex flex-col sm:flex-row justify-between items-center md:col-span-2">
          <p class="text-sm text-gray-500 mb-4 sm:mb-0 max-w-md">
            <i class="fas fa-info-circle mr-1 text-primary-light"></i>
            Tous les champs marqués d'un <span class="text-red-600">*</span> sont obligatoires
          </p>
          <button type="submit" class="btn-primary px-6 py-3 w-full sm:w-auto transform transition hover:scale-105">
            Suivant <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { reactive, computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'

export default {
  name: 'PersonalInfo',
  setup(props, { emit }) {
    const store = useStore()

    const accordionStates = reactive({
      candidat1: true,
      candidat2: false,
      candidat3: false
    })

    const toggleAccordion = (accordion) => {
      accordionStates[accordion] = !accordionStates[accordion]
    }

    const form = reactive({
      stageType: '',
      firstName: store.state.applicationForm.personalInfo.firstName,
      lastName: store.state.applicationForm.personalInfo.lastName,
      email: store.state.applicationForm.personalInfo.email,
      phone: store.state.applicationForm.personalInfo.phone,
      address: store.state.applicationForm.personalInfo.address,
      city: store.state.applicationForm.personalInfo.city,
      dateOfBirth: store.state.applicationForm.personalInfo.dateOfBirth,
      nationality: store.state.applicationForm.personalInfo.nationality,
      gender: store.state.applicationForm.personalInfo.gender,
      educationLevel: store.state.applicationForm.personalInfo.educationLevel,
      groupMembers: [],
      profilePhoto: store.state.applicationForm.personalInfo.profilePhoto
    })

    const photoError = ref('')

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return

      // Validation du type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        photoError.value = 'Format de fichier non supporté. Utilisez JPG, PNG ou GIF.'
        return
      }

      // Validation de la taille (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        photoError.value = 'La taille du fichier ne doit pas dépasser 5MB.'
        return
      }

      // Lecture du fichier et création de l'URL de prévisualisation
      const reader = new FileReader()
      reader.onload = (e) => {
        form.profilePhoto = e.target.result
        photoError.value = ''
      }
      reader.readAsDataURL(file)
    }

    const removePhoto = () => {
      form.profilePhoto = ''
      photoError.value = ''
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }

    const rules = computed(() => ({
      stageType: { required: helpers.withMessage('Veuillez sélectionner le type de stage', required) },
      firstName: { required: helpers.withMessage('Veuillez entrer votre prénom', required) },
      lastName: { required: helpers.withMessage('Veuillez entrer votre nom', required) },
      email: { 
        required: helpers.withMessage('Veuillez entrer votre email', required),
        email: helpers.withMessage('Veuillez entrer un email valide', email)
      },
      phone: { required: helpers.withMessage('Veuillez entrer votre numéro de téléphone', required) },
      address: { required: helpers.withMessage('Veuillez entrer votre adresse', required) },
      city: { required: helpers.withMessage('Veuillez entrer votre ville', required) },
      dateOfBirth: { required: helpers.withMessage('Veuillez entrer votre date de naissance', required) },
      nationality: { required: helpers.withMessage('Veuillez entrer votre nationalité', required) },
      gender: { required: helpers.withMessage('Veuillez sélectionner votre genre', required) },
      educationLevel: { required: helpers.withMessage('Veuillez sélectionner votre niveau d\'études', required) }
    }))

    const v$ = useVuelidate(rules, form)

    watch(() => form.stageType, (newType) => {
      form.groupMembers = []
      if (newType === 'binome') {
        form.groupMembers.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          dateOfBirth: '',
          nationality: '',
          gender: '',
          educationLevel: ''
        })
      } else if (newType === 'groupe') {
        form.groupMembers.push({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          dateOfBirth: '',
          nationality: '',
          gender: '',
          educationLevel: ''
        })
      }
    })

    const addGroupMember = () => {
      form.groupMembers.push({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        dateOfBirth: '',
        nationality: '',
        gender: '',
        educationLevel: ''
      })
      accordionStates[`candidat${form.groupMembers.length + 1}`] = false;
    }

    const removeGroupMember = (index) => {
      form.groupMembers.splice(index, 1);
    }

    const submitForm = async () => {
      // Validation de la photo
      if (!form.profilePhoto) {
        photoError.value = 'Veuillez ajouter une photo de profil'
        return
      }

      const result = await v$.value.$validate()
      if (result) {
        store.commit('updatePersonalInfo', form)
        store.commit('nextStep')
      }
    }

    return {
      form,
      v$,
      submitForm,
      accordionStates,
      toggleAccordion,
      addGroupMember,
      removeGroupMember,
      handleFileUpload,
      removePhoto,
      photoError
    }
  }
}
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors;
}

.error-message {
  @apply text-red-500 text-sm mt-1 flex items-center;
}

.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200;
}

/* Animation pour l'upload de photo */
.animate__fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles pour la zone de prévisualisation */
.profile-photo-preview {
  @apply transition-all duration-300;
}

.profile-photo-preview:hover {
  @apply transform scale-105;
}

/* Styles pour les boutons d'action */
.action-button {
  @apply transition-all duration-200;
}

.action-button:hover {
  @apply transform scale-105;
}
</style>