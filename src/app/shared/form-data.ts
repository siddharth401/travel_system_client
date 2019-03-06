import { FormArray, FormBuilder } from '@angular/forms';

export class FormData
{
    private app;

    public form;
    public isNew = true;

    private formBuilder;
    private structureParent = {};
    private structureChild = [];

    constructor(app,structure)
    {
        this.app = app;

        this.formBuilder = new FormBuilder();
        this.structureParent = structure;
        this.form = this.formBuilder.group(structure);
    }

    public initChild(name,obj)
    {
        this.structureChild[name] = obj;
        this.form.registerControl(name,this.formBuilder.array([]));
    }

    public addItem(name)
    {
        (<FormArray>this.form.controls[name]).push(this.formBuilder.group(this.structureChild[name]));
    }

    public removeItem(name,index:number)
    {
        (<FormArray>this.form.controls[name]).removeAt(index);
    }

    public bindData(apiUrl,params?:{})
    {
        this.app.get(apiUrl, params).then(res =>
        {
            if (res.status === 200)
            {
                this.setData(res.json().data);
            }
        });
    }

    setData(data)
    {
        this.form.patchValue(data);
        for (let name in this.structureChild)
        {
            if (typeof data[name] !== 'undefined')
            {
                data[name].forEach(e =>
                {
                    (<FormArray>this.form.controls[name]).push(this.formBuilder.group(e));
                });
            }
        }
    }
}