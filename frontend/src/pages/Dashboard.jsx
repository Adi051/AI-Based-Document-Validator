import React from "react";
import { Link, useNavigate } from "react-router-dom";
import VerificationTrend from "../components/Verificationtrend";

const Dashboard = () => {

     const navigate = useNavigate(); 
  return (
    <>
     <div class="page-wrapper">
    
       <div class="page-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="page-title-box d-md-flex justify-content-md-between align-items-center">
                            <h4 class="page-title">Dashboard</h4>
                            <div class="">
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item"><a href="#">panel</a>
                                    </li>
                                    <li class="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>                            
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card  bg-welcome-img overflow-hidden">
                                    <div class="card-body">
                                        <div class="">                                            
                                            <h3 class="text-white fw-semibold fs-20 lh-base">Verify Your Document
                                            </h3>
                                            <Link to="/app/uploads" class="btn btn-sm btn-danger">Upload Now </Link>
                                            <img src="/assets/images/extra/fund.png" alt="" class=" mb-n4 float-end" height="107"/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-globe-img">
                                    <div class="card-body">
                                        <div>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="fs-16 fw-semibold">Verification Success Rate</span>
                                                <form class="">
                                                    <select id="dynamic-select" name="example-select" data-placeholder="Select an option" data-dynamic-select>
                                                    </select>
                                                </form>
                                            </div>
                                            
                                            <h4 class="my-2 fs-24 fw-semibold">90.1% <small class="font-14">Rate </small></h4>                                            
                                            <p class="mb-3 text-muted fw-semibold">
                                            <span class="text-success"><i class="fas fa-arrow-up me-1"></i>2.4%</span> Improvement in AI validat                                            </p> 
                                             <button
                          type="button"
                          className="btn btn-soft-primary me-2"
                          onClick={() => navigate("/app/history")}
                        >
                          View Report
                        </button>


                                           <button
                          type="button"
                          className="btn btn-soft-danger"
                          onClick={() => navigate("/app/uploads")}
                        >
                          Re-scan
                        </button> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="row justify-content-center">
                            <div class="col-md-6 col-lg-6">
                                <div class="card bg-corner-img">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">
                                                <p class="text-muted text-uppercase mb-0 fw-normal fs-13">Total Active Users</p>
                                                <h4 class="mt-1 mb-0 fw-medium">25</h4>
                                            </div>
                                            
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md border-dashed border-primary rounded mx-auto">
                                                    <i class="iconoir-dollar-circle fs-22 align-self-center mb-0 text-primary"></i>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                
                                </div>
                            </div>
                            
                            <div class="col-md-6 col-lg-6">
                                <div class="card bg-corner-img">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">
                                                <p class="text-muted text-uppercase mb-0 fw-normal fs-13">Fake Documents Detected</p>
                                                <h4 class="mt-1 mb-0 fw-medium">34</h4>
                                            </div>
                                            
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md border-dashed border-info rounded mx-auto">
                                                    <i class="iconoir-cart fs-22 align-self-center mb-0 text-info"></i>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                            <div class="col-md-6 col-lg-6">
                                <div class="card bg-corner-img">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">
                                                <p class="text-muted text-uppercase mb-0 fw-normal fs-13">Avg Validation Time</p>
                                                <h4 class="mt-1 mb-0 fw-medium">3.4 sec</h4>
                                            </div>
                                        
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md border-dashed border-warning rounded mx-auto">
                                                    <i class="iconoir-percentage-circle fs-22 align-self-center mb-0 text-warning"></i>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                
                            </div>
                        
        
                            <div class="col-md-6 col-lg-6">
                                <div class="card bg-corner-img">
                                    <div class="card-body">
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-9">
                                                <p class="text-muted text-uppercase mb-0 fw-normal fs-13">Avg. Document Integrity Score</p>
                                                <h4 class="mt-1 mb-0 fw-medium">94.6%</h4>
                                            </div>
                                            
                                            <div class="col-3 align-self-center">
                                                <div class="d-flex justify-content-center align-items-center thumb-md border-dashed border-danger rounded mx-auto">
                                                    <i class="iconoir-hexagon-dice fs-22 align-self-center mb-0 text-danger"></i>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                                
                            </div>       
                        </div>
                        
                    </div>
                    
                </div>
                
                <div class="row justify-content-center">
                    
                    <div class="col-md-12 col-lg-6">
                        <VerificationTrend/>
                       
                        
                    </div>
                    
                    <div class="col-md-6 col-lg-3">
                        <div class="card">
                            <div class="card-header">
                                <div class="row align-items-center">
                                    <div class="col">
                                        <h4 class="card-title">Content Authenticity Analysis</h4>
                                    </div>
                                    
                                   
                                </div>
                            </div>
                            <div class="card-body pt-0">
                                <div id="cashflow" class="apex-charts"></div>
                                <div class="row">
                                    <div class="col-4">
                                        <div class="text-center">
                                            <p class="text-muted text-uppercase mb-0 fw-medium fs-13">Original</p>
                                            <h5 class="mt-1 mb-0 fw-medium">76%</h5>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="text-center">
                                            <p class="text-muted text-uppercase mb-0 fw-medium fs-13">Minor Tampering</p>
                                            <h5 class="mt-1 mb-0 fw-medium">23%</h5>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="text-center">
                                            <p class="text-muted text-uppercase mb-0 fw-medium fs-13">Major Issue</p>
                                            <h5 class="mt-1 mb-0 fw-medium">1%</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class=" text-center mx-auto">
                                    <img src="/assets/images/extra/rabit.png" alt="" class="d-inline-block" height="105"/>
                                </div>
                                <div class="card-bg position-relative z-0">
                                    <div class="p-3 bg-primary-subtle rounded position-relative">                                    
                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3">
                        <div class="card">
                            <div class="card-header">
                                <div class="row align-items-center">
                                    <div class="col">                      
                                        <h4 class="card-title">Document Type Verification Stats</h4>                      
                                    </div>
                                </div>                                   
                            </div>
                            <div class="card-body pt-0">
                                <div class="table-responsive">
                                    <table class="table mb-0">
                                        <tbody>
                                            <tr class="">                                                        
                                                <td class="px-0">
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0 text-truncate">Certificates</h6>
                                                    </div>
                                                </td>
                                                <td  class="px-0 text-end"><span class="text-body ps-2 align-self-center text-end fw-medium">0.835230 <span class="badge rounded text-success bg-success-subtle">1.10%</span></span></td> 
                                            </tr>
                                            <tr class="">                                                        
                                                <td class="px-0">
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0 text-truncate">Assignments</h6>
                                                    </div>
                                                </td>
                                                <td  class="px-0 text-end"><span class="text-body ps-2 align-self-center text-end fw-medium">0.896532 <span class="badge rounded text-success bg-success-subtle">0.91%</span></span></td> 
                                            </tr>
                                            <tr class="">                                                        
                                                <td class="px-0">
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0 text-truncate">Marksheet</h6>
                                                    </div>
                                                </td>
                                                <td  class="px-0 text-end"><span class="text-body ps-2 align-self-center text-end fw-medium">0.875433 <span class="badge rounded text-danger bg-danger-subtle">0.11%</span></span></td> 
                                            </tr>
                                            <tr class="">                                                        
                                                <td class="px-0">
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0 text-truncate">Research Papers</h6>
                                                    </div>
                                                </td>
                                                <td  class="px-0 text-end"><span class="text-body ps-2 align-self-center text-end fw-medium">0.795621 <span class="badge rounded text-success bg-success-subtle">0.85%</span></span></td> 
                                            </tr>
                                            <tr class="">                                                        
                                                <td class="px-0">
                                                    <div class="d-flex align-items-center">
                                                        <h6 class="m-0 text-truncate">ID Proofs</h6>
                                                    </div>
                                                </td>
                                                <td  class="px-0 text-end"><span class="text-body ps-2 align-self-center text-end fw-medium">0.875433 <span class="badge rounded text-danger bg-danger-subtle">0.11%</span></span></td> 
                                            </tr>
                                            
                                        </tbody>
                                    </table>                  
                                </div> 
                                <hr class="hr-dashed"/>     
                                            
                            </div> 
                        </div> 
                    </div> 
                </div>

                
            </div>

            
            
            <div class="offcanvas offcanvas-end" tabindex="-1" id="Appearance" aria-labelledby="AppearanceLabel">
                <div class="offcanvas-header border-bottom justify-content-between">
                  <h5 class="m-0 font-14" id="AppearanceLabel">Appearance</h5>
                  <button type="button" class="btn-close text-reset p-0 m-0 align-self-center" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">  
                    <h6>Account Settings</h6>
                    <div class="p-2 text-start mt-3">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="settings-switch1"/>
                            <label class="form-check-label" for="settings-switch1">Auto updates</label>
                        </div>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="settings-switch2" checked/>
                            <label class="form-check-label" for="settings-switch2">Location Permission</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="settings-switch3"/>
                            <label class="form-check-label" for="settings-switch3">Show offline Contacts</label>
                        </div>
                    </div>
                    <h6>General Settings</h6>
                    <div class="p-2 text-start mt-3">
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="settings-switch4"/>
                            <label class="form-check-label" for="settings-switch4">Show me Online</label>
                        </div>
                        <div class="form-check form-switch mb-2">
                            <input class="form-check-input" type="checkbox" id="settings-switch5" checked/>
                            <label class="form-check-label" for="settings-switch5">Status visible to all</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="settings-switch6"/>
                            <label class="form-check-label" for="settings-switch6">Notifications Popup</label>
                        </div>
                    </div>        
                </div>
            </div>
            
            
            
            
           
        </div>
        </div>
        
    </>
  );
};

export default Dashboard;
