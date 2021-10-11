<template>
    <div>
        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">All Companies</h1>
        </div>

        <!-- Content Row -->
        <div class="row p-3">
            <div class="card m-auto">
                <div class="card-header d-flex">
                    <span>
                        <i class="fa fa-building"></i>
                        Companies
                    </span>
                    <button class="btn btn-primary btn-sm ml-auto" v-on:click="showNewCompanyModal"><span class="fa fa-plus"></span> Add New</button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Logo</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(company, index) in companies" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{ company.name }}</td>
                            <td>{{ company.email }}</td>
                            <td>
                                <img class="table-image" :src="`${$store.state.serverPath}/storage/${company.image}`" :alt="company.name">
                            </td>
                            <td>
                                <button class="btn btn-primary btn-sm"><span class="fa fa-edit"></span></button>
                                <button class="btn btn-danger btn-sm" v-on:click="deleteCompany(company)"><span class="fa fa-trash"></span></button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <b-modal ref="newCompanyModal" hide-footer title="Add New Company">
            <div class="d-block">
                <form v-on:submit.prevent="createCompany">
                    <div class="form-group">
                        <label for="name">Company Name</label>
                        <input type="text" class="form-control" v-model="companyData.name" id="name" placeholder="Apple">
                        <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="email">Company Email</label>
                        <input type="email" class="form-control" v-model="companyData.email" id="email" placeholder="info@apple.com">
                        <div class="invalid-feedback" v-if="errors.email">{{ errors.email[0] }}</div>
                    </div>
                    <div class="form-group">
                        <label for="image">Company Logo</label>
                        <div v-if="companyData.image.name">
                            <img src="" ref="newCompanyImageDisplay" class="w-150px" />
                        </div>
                        <br>
                        <input type="file" class="form-control" v-on:change="attachImage" ref="newCompanyImage" id="image">
                        <div class="invalid-feedback" v-if="errors.image">{{ errors.image[0] }}</div>
                    </div>
                    <div class="text-right">
                        <button type="button" class="btn btn-default" v-on:click="hideNewCompanyModal">Cancel</button>
                        <button type="submit" class="btn btn-success"><span class="fa fa-check"></span> Save</button>
                    </div>
                </form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import * as companyService from '../services/company_service';
export default {
    name: "Companies",
    data() {
        return {
            companies: [],
            companyData: {
                name: '',
                email: '',
                image: ''
            },
            errors: {}
        }
    },
    mounted() {
        this.loadCompanies();
    },
    methods: {
        loadCompanies: async function() {
            try {
                const response = await companyService.loadCompanies();
                this.companies = response.data.data;
            } catch (error) {
                this.flashMessage.error({
                    title: 'Error Message',
                    message: 'An Error Occurred, please try again!',
                    time: 5000
                });
            }
        },
        attachImage() {
            this.companyData.image = this.$refs.newCompanyImage.files[0];
            let reader = new FileReader();
            reader.addEventListener('load', function () {
                this.$refs.newCompanyImageDisplay.src = reader.result;
            }.bind(this), false);

            reader.readAsDataURL(this.companyData.image);
        },
        hideNewCompanyModal() {
            this.$refs.newCompanyModal.hide();
        },
        showNewCompanyModal() {
            this.$refs.newCompanyModal.show();
        },
        createCompany: async function () {
            let formData = new FormData();
            formData.append('name', this.companyData.name);
            formData.append('email', this.companyData.email);
            formData.append('image', this.companyData.image);

            try {
                const response = await companyService.createCompany(formData);
                this.companies.unshift(response.data);
                this.hideNewCompanyModal();
                this.flashMessage.success({
                    title: 'Success Message',
                    message: 'Company has been Added successfully',
                    time: 5000
                });
                this.companyData = {
                    name: '',
                    email: '',
                    image: ''
                };
            } catch (error) {
                switch (error.response.status) {
                    case 422:
                        this.errors = error.response.data.errors;
                        break;
                    default:
                        this.flashMessage.error({
                            title: 'Error Message',
                            message: 'An Error Occurred, please try again!',
                            time: 5000
                        });
                        break;
                }
            }
        },
        deleteCompany: async function(company) {
            if(!window.confirm(`Are you sure you want to delete '${company.name}'?`)) {
                return;
            }

            try {
                await companyService.deleteCompany(company.id)
            } catch (error) {

            }
        }
    }
}
</script>

<style scoped>

</style>
