# LINKS
# Clean links import (wipes out existing links)

$dataFilePath = "c:\projects\Sitecore.Link\data\import\files\data.xml"
$linksRootPath = "/sitecore/content/Data/Links"
$topicsRootPath = "/sitecore/content/Data/Categories"
$counter = 0

# Ensure topics with categories already exist
if(-Not(Test-Path -Path $topicsRootPath) -or (Get-ChildItem -Path $topicsRootPath).Count -eq 0)
{
    Write-Host Error: Please import the topics and categories first.
    return
}

# Ensure parent item for links exists
if(-Not(Test-Path -Path $linksRootPath))
{
    Write-Host Links parent item doesn`'t exist`, creating one...
    $linksRoot =  New-Item -Path $linksRootPath -ItemType "Common/Folder"
    
    $linksRoot.Editing.BeginEdit()
    $linksRoot["__Is Bucket"] = "1"
    # Assigning result just not to print to output
    $r = $linksRoot.Editing.EndEdit()
    
    Write-Host `n
}

# Remove existing links
New-UsingBlock (New-Object Sitecore.Data.BulkUpdateContext) {
    Write-Host Removing existing links...
    Get-ChildItem -Path $linksRootPath | Remove-Item -Recurse -Permanently
    Write-Host `n
}

$topicsRoot = Get-Item -Path $topicsRootPath

$f = [System.Xml.XmlReader]::create($dataFilePath)
while ($f.read())
{
    switch ($f.NodeType)
    {
        ([System.Xml.XmlNodeType]::Element)
        {
            if ($f.Name -eq "article")
            {
                $e = [System.Xml.Linq.XElement]::ReadFrom($f)
                if ($e -ne $null)
                {
                    $name = $e.Name
                    $title = [string] $e.Attribute("title").value
                    $url = [string] $e.Attribute("url").value
                    $date = [string] $e.Attribute("date").value
                    
                    $categories = [System.Xml.Linq.XElement] $e.Element("categories")
                    $codes = [Array] $categories.Elements("code").value
                    
                    $newItem = New-Item -Path $linksRootPath `
                                        -Name ([Sitecore.Data.Items.ItemUtil]::ProposeValidItemName($title)) `
                                        -ItemType "{AF742425-1E7B-4DA0-97C8-D39CA3093F37}"
                    
                    if($newItem -ne $null)
                    {
                        $newItem.Editing.BeginEdit()
                        $newItem["title"] = $title
                        $newItem["date"] = [sitecore.dateutil]::ToIsoDate($date)
                        $newItem["__Bucketable"] = "1"
                        
                        $newItem.PSFields."linkurl".text = $title
                        $newItem.PSFields."linkurl".url = $url
                        $newItem.PSFields."linkurl".linktype = "external"
                        
                        foreach($code in $codes)
                        {
                            $criteria = @(
                                @{ Filter = "Equals"; Field = "categoryid"; Value = $code },
                                @{ Filter = "Equals"; Field = "_templatename"; Value = "Category" },
                                @{ Filter = "DescendantOf"; Value = $topicsRoot }
                            )
                            $props = @{
                                Index = "sitecore_master_index"
                                Criteria = $criteria
                            }
                            $category = Find-Item @props -First 1 | Select-Object -Expand "Fields"
                            $categoryId = [GUID]($category["itemid"])
                            
                            # Add category to link
                            $newItem["Category"] = $categoryId
                            
                            # Add link to category
                            $categoryItem = Get-Item -Path "master:" -ID $categoryId
                            
                            $categoryItem.Editing.BeginEdit()
                            if($categoryItem["Links"] -ne "")
                            {
                                $categoryItem["Links"] = [string]::Concat($categoryItem["Links"], "|")
                            }
                            $categoryItem["Links"] = [string]::Concat($categoryItem["Links"], $newItem.Id)
                            
                            # Assigning result just not to print to output
                            $r = $categoryItem.Editing.EndEdit()
                        }
                        # Assigning result just not to print to output
                        $r = $newItem.Editing.EndEdit()
                    }
                }
                $counter = $counter + 1
                Write-Host Imported $counter items
            }
            break
        }
    }
}
Write-Host `n
Write-Host Done.
